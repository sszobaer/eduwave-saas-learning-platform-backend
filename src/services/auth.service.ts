import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/dtos/Register/create-register.dto';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserCredential } from 'src/entities/user-credentital.entity';
import { LoginDto } from 'src/dtos/Login/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenDto } from 'src/dtos/RefreshToken/refreh-token.dto';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserCredential)
        private readonly credentialRepo: Repository<UserCredential>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        private dataSource: DataSource,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepo: Repository<RefreshToken>,
        private readonly emailService: EmailService
    ) { }

    async register(data: RegisterDto): Promise<object> {
        const exists = await this.credentialRepo.findOneBy({ email: data.email });
        if (exists) throw new BadRequestException("Email already in use");

        const role = await this.roleRepo.findOneBy({ role_name: data.role_name })
        if (!role) throw new BadRequestException("Invalid Role!");

        const saltRound = 10;

        const hashed_password = await bcrypt.hash(data.password, saltRound);

        return this.dataSource.transaction(async (manager) => {

            const newCredential = manager.create(UserCredential, {
                email: data.email,
                password: hashed_password,
            });
            await manager.save(newCredential);

            const isTeacher = role.role_name === 'teacher';
            const newUser = manager.create(User, {
                full_name: data.full_name,
                profile_img: data.profile_img,
                role: role,
                credential: newCredential,
                isActive: !isTeacher,
            });

            return await manager.save(newUser);
        });
    }

    //Login Logic
    async login(data: LoginDto) {
        const credential = await this.credentialRepo.findOne({
            where: { email: data.email },
            relations: ['user', 'user.role']
        });

        if (!credential) throw new BadRequestException('Invalid Credentials!');

        if (!credential.user.isActive) {
            throw new UnauthorizedException('User is blocked');
        }

        const isMatch = await bcrypt.compare(data.password, credential.password);

        if (!isMatch)
            throw new BadRequestException('Wrong Credentials!');

        const payload = {
            sub: credential.user.user_id,
            role: credential.user.role.role_name
        };

        const accessToken = this.jwtService.sign(payload);

        const refreshToken = uuidv4();
        await this.storeRefreshToken(refreshToken, credential.user);

        this.emailService.sendEmail({
            to: credential.email,
            subject: 'New Login Alert',
            text: `Hi ${credential.user.full_name}, your account was just accessed.`,
            html: `<p>Hi <strong>${credential.user.full_name}</strong>,</p>
               <p>We noticed a login to your account. If this was you, you can safely ignore this email.</p>
               <p>If you did not log in, please reset your password immediately.</p>`,
            from: '"EduWave LMS Platform" <no-reply@yourapp.com>',
        }).catch(err => console.error('Login email failed:', err));

        return {
            message: 'Login Successful',
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: credential.user.user_id,
                name: credential.user.full_name,
                email: credential.email,
                role: credential.user.role.role_name,
            }
        }
    }

    async refreshTokens(refreshToken: RefreshTokenDto) {
        const token = await this.refreshTokenRepo.findOne({
            where: {
                token: refreshToken.token,
                expiresAt: MoreThanOrEqual(new Date()),
            },
            relations: ['user', 'user.role'],
        })

        if (!token) throw new UnauthorizedException("Invalid Refresh Token");

        const user = token.user;

        const payload = {
            sub: user.user_id,
            role: user.role.role_name,
        };

        const newAccessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
        });

        const newRefreshToken = uuidv4();
        await this.storeRefreshToken(newRefreshToken, user);

        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        };
    }


    async storeRefreshToken(token: string, user: User) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 3);

        const refreshToken = this.refreshTokenRepo.create({
            token,
            user,
            expiresAt
        });

        return await this.refreshTokenRepo.save(refreshToken);
    }
}
