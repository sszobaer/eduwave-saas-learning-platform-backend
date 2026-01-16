import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dtos/User/create-user.dto";
import { UpdateUserDto } from "src/dtos/User/update-user.dto";
import { Role } from "src/entities/role.entity";
import { User } from "src/entities/user.entity";
import { DataSource, Repository } from "typeorm";

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

    async findAll(): Promise<object> {
        const users = await this.userRepo.find({
        relations: ['role', 'credential'],
        order: { user_id: 'DESC' }
    });

    if (!users.length) throw new BadRequestException('No users found');


    const response = users.map(user => ({
        user_id: user.user_id,
        full_name: user.full_name,
        profile_img: user.profile_img,
        isActive: user.isActive,
        role: {
            role_id: user.role.role_id,
            role_name: user.role.role_name,
        },
        credential: {
            email: user.credential.email,
        }
    }));

    return response;
}

    async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
        where: { user_id: id },
        relations: ['role', 'credential'], // include role & email
    });

    if (!user) throw new BadRequestException(`No user with ID ${id} found`);

    return user;
}

async blockUser(userId: number) {
    const user = await this.userRepo.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new BadRequestException('User already blocked');
    }

    user.isActive = false;
    await this.userRepo.save(user);

    return {
      message: 'User blocked successfully',
      user_id: user.user_id,
      isActive: user.isActive,
    };
  }

  // Unblock user
  async unblockUser(userId: number) {
    const user = await this.userRepo.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = true;
    await this.userRepo.save(user);

    return {
      message: 'User unblocked successfully',
      user_id: user.user_id,
      isActive: user.isActive,
    };
  }

    async remove(id: number): Promise<void>{
        const response = await this.userRepo.delete(id);

        if (response.affected === 0) throw new NotFoundException('User Not Found. Try Agin');
    }
}