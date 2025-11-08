import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dtos/User/create-user.dto";
import { UpdateUserDto } from "src/dtos/User/update-user.dto";
import { Role } from "src/entities/role.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }
    //Auth is pending

    async create(data: CreateUserDto): Promise<User> {
        const role = await this.userRepo.manager.getRepository(Role).findOneBy({ role_id: data.role_id });
        if (!role) throw new BadRequestException('Role not found');

        const user = this.userRepo.create({
            ...data,
            role,
        })

        return this.userRepo.save(user);
    }

    async update(id: number, data: UpdateUserDto): Promise<User> {
            const user = await this.findOne(id);
            if(!user) throw new NotFoundException(`User Not Found. Try again`);
    
            Object.assign(user,data);
            return this.userRepo.save(user);
        }

    async findAll(): Promise<any[]> {
        const users = await this.userRepo.find({ relations: ['role'] });
        if (!users.length) throw new BadRequestException('No user found');

        return users.map((user) => ({
            ...user,
            role: {
                role_id: user.role.role_id,
                role_name: user.role.role_name,
            },
        }));
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
}