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
import { ForgotPasswordDto } from 'src/dtos/ForgotPassword/forgot-password.dto';
import { VerifyOtpDto } from 'src/dtos/VerifyOtp/verify-oto.dto';
import { ResetPasswordDto } from 'src/dtos/ResetPassword/reset-password.dto';
import { ChangePasswordAfterLoginDto } from "src/dtos/ChangePassword/change-password-after-login.dto";
import { LogoutDto } from 'src/dtos/Logout/logout.dto';
import { PusherService } from './pusher.service';


@Injectable()
export class AuthService {
    private otpCache: { [email: string]: { otp: string, expiresAt: number } } = {}; // Temporary OTP storage

    constructor(
        @InjectRepository(UserCredential)
        private readonly credentialRepo: Repository<UserCredential>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        private dataSource: DataSource,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepo: Repository<RefreshToken>,
        private readonly emailService: EmailService,
        private readonly pusherService: PusherService
    ) { }

    async register(data: RegisterDto): Promise<object> {
        const exists = await this.credentialRepo.findOneBy({ email: data.email });
        if (exists) throw new BadRequestException("Email already in use");

        const role = await this.roleRepo.findOneBy({ role_name: data.role_name });
        if (!role) throw new BadRequestException("Invalid Role!");

        const hashed_password = await bcrypt.hash(data.password, 10);

        return this.dataSource.transaction(async (manager) => {

            const newCredential = manager.create(UserCredential, {
                email: data.email,
                password: hashed_password,
            });
            await manager.save(newCredential);


            const isTeacher = role.role_name === 'TEACHER';
            const newUser = manager.create(User, {
                full_name: data.full_name,
                profile_img: data.profile_img,
                role,
                credential: newCredential,
                isActive: !isTeacher,
            });

            const savedUser = await manager.save(newUser);


            if (isTeacher) {
                await this.emailService.sendEmail({
                    to: newCredential.email,
                    subject: 'Teacher Account Pending Approval',
                    template: 'teacher-pending',
                    context: {
                        name: savedUser.full_name,
                    },
                });
                await this.pusherService.trigger("admin-channel", "new-teacher", {
                    userId: savedUser.user_id,
                    fullName: savedUser.full_name,
                    email: newCredential.email,
                    createdAt: savedUser.created_at,
                });
                console.log("Pusher triggered:", savedUser.full_name);
            }

            return {
                message: isTeacher
                    ? 'Registration successful. Please wait for admin approval.'
                    : 'Registration successful.',
            };
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

        //Mailer functionality
        await this.emailService.sendEmail({
            to: credential.email,
            subject: 'New Login Alert',
            template: 'login-alert',
            context: {
                name: credential.user.full_name,
            },
        });

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

    // Forgot Password: Generate OTP and send email
    async forgotPassword(data: ForgotPasswordDto): Promise<object> {
        const userCredential = await this.credentialRepo.findOne({
            where: { email: data.email },
            relations: ['user'],
        });

        if (!userCredential) throw new BadRequestException('Email not found.');

        const otp = this.generateOtp();
        const expiration = Date.now() + 600000; // OTP valid for 10 minutes

        // Store OTP temporarily (e.g., in-memory cache)
        this.storeOtp(data.email, otp, expiration);

        // Send OTP to user's email
        await this.emailService.sendEmail({
            to: data.email,
            subject: 'Password Reset OTP',
            template: 'forgot-password-otp',
            context: {
                name: userCredential.user.full_name,
                otp,
            },
        });

        return { message: 'OTP sent to your email.' };
    }


    // Verify OTP
    async verifyOtp(otpDto: VerifyOtpDto): Promise<object> {
        const { email, otp } = otpDto;

        const storedOtp = this.validateOtp(email, otp);
        if (!storedOtp) throw new BadRequestException('Invalid or expired OTP');

        const resetToken = this.jwtService.sign(
            { email },
            { expiresIn: "10m" }
        );
        return { resetToken };
    }


    async resetPassword(data: ResetPasswordDto): Promise<object> {
        const { resetToken, newPassword } = data;

        // Validate the resetToken
        try {
            const decoded = this.jwtService.verify(resetToken);
            const email = decoded.email;

            // Hash the new password
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRound);

            // Update the password
            const userCredential = await this.credentialRepo.findOne({
                where: { email },
                relations: ['user'],
            });

            if (!userCredential) throw new BadRequestException('User not found.');

            userCredential.password = hashedPassword;
            await this.credentialRepo.save(userCredential);

            return { message: 'Password updated successfully.' };
        } catch (error) {
            throw new BadRequestException('Invalid or expired reset token.');
        }
    }


    async changePasswordAfterLogin(
        userId: number, data: ChangePasswordAfterLoginDto) {

        const credential = await this.credentialRepo.findOne({
            where: { user: { user_id: userId } },
            relations: ['user']
        });

        if (!credential) throw new BadRequestException("User not found");

        // verify old password
        const isMatch = await bcrypt.compare(data.oldPassword, credential.password);
        if (!isMatch) throw new UnauthorizedException("Old password is incorrect");

        // hash new password
        const hashed = await bcrypt.hash(data.newPassword, 10);

        credential.password = hashed;
        await this.credentialRepo.save(credential);

        // Send email notification
        await this.emailService.sendEmail({
            to: credential.email,
            subject: 'Your Password Has Been Changed',
            template: 'password-changed', // you can create this template in your mailer
            context: {
                name: credential.user.full_name,
                date: new Date().toLocaleString(),
            },
        });


        return { message: "Password changed successfully" };
    }


    // Utility: Generate a 6-digit OTP
    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Store OTP temporarily (in-memory or a cache solution like Redis)
    private storeOtp(email: string, otp: string, expiresAt: number) {
        this.otpCache[email] = { otp, expiresAt };
    }

    // Validate OTP (check expiration and correctness)
    private validateOtp(email: string, otp: string): boolean {
        const otpEntry = this.otpCache[email];
        if (!otpEntry) return false;

        if (otpEntry.otp !== otp || Date.now() > otpEntry.expiresAt) {
            return false;
        }
        return true;
    }

    // Clear OTP after use
    private clearOtp(email: string) {
        delete this.otpCache[email];
    }

    // Logout functionality
    async logout(logoutDto: LogoutDto): Promise<object> {
        const { token } = logoutDto;

        // Find the refresh token in DB
        const storedToken = await this.refreshTokenRepo.findOne({
            where: { token },
        });

        if (!storedToken) {
            // Token not found, maybe already logged out
            throw new BadRequestException("Invalid token or already logged out");
        }

        // Delete the token from DB
        await this.refreshTokenRepo.remove(storedToken);

        return { message: "Logout successful" };
    }
}