import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dtos/User/create-user.dto";
import { UserResponseDto } from "src/dtos/User/response-user.dto";
import { UpdateUserDto } from "src/dtos/User/update-user.dto";
import { Role } from "src/entities/role.entity";
import { User } from "src/entities/user.entity";
import { And, DataSource, Like, Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private dataSource: DataSource
    ) { }

    async create(data: CreateUserDto): Promise<User> {
        const role = await this.userRepo.manager.getRepository(Role).findOne({
            where : {role_id : data.role_id},
            select: ['role_id', 'role_name']
        });
        if (!role) throw new BadRequestException('Role not found');

        const user = this.userRepo.create({
            ...data,
            role,
            isActive: true
        })

        return this.userRepo.save(user);
    }

    async update(id: number, data: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        if(!user) throw new NotFoundException(`User Not Found. Try again`);
    
        Object.assign(user,data);
        return this.userRepo.save(user);
        }

        // const users = await this.userRepo.find({ 
        //     relations: ['role'],
        //     where: {
        //         role: {
        //             role_id: 1
        //         }
        //     },
        //     order: {
        //         user_id: 'DESC'
        //     }
        //  } );
        // if (!users.length) throw new BadRequestException('No user found');

// where: {
             // full_name: Like('s%zz%')
        // }

        // return users.map((user) => ({
        //     ...user,
        //     role: {
        //         role_id: user.role.role_id,
        //         role_name: user.role.role_name,
        //     },
        // }));
    async findAll(): Promise<object> {
        const users = await this.dataSource.getRepository(User).find({
        relations: ['role', 'credential'],
        order: { user_id: 'DESC' },
        select: ['user_id']
    });

    if (!users.length) throw new BadRequestException('No users found');


    const response = users.map(user => ({
        user_id: user.user_id,
        full_name: user.full_name,
        profile_img: user.profile_img,
        
        role: {
            role_id: user.role.role_id,
            role_name: user.role.role_name,
        },

        credential: {
            email: user.credential.email,
        }
    }));

    return { 
        //total: users.length,
        data: response 
        };
}

    async findOne(id: number): Promise<User> {
        const user = await this.userRepo.findOneBy({ user_id: id });

        if (!user) throw new BadRequestException(`No roles with this ${id} exist`);

        return user;
    }

    async remove(id: number): Promise<void>{
        const response = await this.userRepo.delete(id);

        if (response.affected === 0) throw new NotFoundException('User Not Found. Try Agin');
    }
    //     const user = await this.userRepo.findOne({
    //         where:{
    //             credential:{
    //                 email: email
    //             }
    //         },
    //         relations:['credential']
    // });

    // if(!user) throw new NotFoundException("User not found");

    // await this.userRepo.delete(user.user_id);
    // }
}