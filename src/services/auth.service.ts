import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/dtos/Register/create-register.dto';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserCredential } from 'src/entities/user-credentital.entity';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserCredential)
        private readonly credentialRepo: Repository<UserCredential>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        private dataSource: DataSource
    ) {}

    async register(data: RegisterDto): Promise<object>{
        const exists = await this.credentialRepo.findOneBy({email: data.email});
        if(exists) throw new BadRequestException("Email already in use");

        const role = await this.roleRepo.findOneBy({role_name: data.role_name})
        if(!role) throw new BadRequestException("Invalid Role!");
        
        const saltRound = 10;
        const hashed_password = await bcrypt.hash(data.password, saltRound);

        return this.dataSource.transaction(async(manager)=>{
            //Insert into Credential
            //Always avoid to naming the as same as the entity class
            const newCredential = manager.create(UserCredential,{
                email: data.email,
                password: hashed_password,
            });
            await manager.save(newCredential);

            const newUser = manager.create(User, {
                full_name: data.full_name,
                profile_img: data.profile_img,
                role: role,
                credential: newCredential,
            });

            return await manager.save(newUser);
        });
    }
}
