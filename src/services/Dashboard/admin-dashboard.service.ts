// src/admin-dashboard/admin-dashboard.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}


  async getDashboardStats() {
    const totalUsers = await this.userRepo.count();
    const activeUsers = await this.userRepo.count({
      where: { isActive: true },
    });

    return {
      totalUsers,
      activeUsers,
      blockedUsers: totalUsers - activeUsers,
    };
  }


  async getAllUsers() {
    const users = await this.dataSource.getRepository(User).find({
      relations: ['role', 'credential'],
      order: { user_id: 'DESC' },
    });

    return users.map(user => ({
      user_id: user.user_id,
      full_name: user.full_name,
      profile_img: user.profile_img,
      isActive: user.isActive,
      created_at: user.created_at,
      role: {
        role_id: user.role.role_id,
        role_name: user.role.role_name,
      },
      credential: {
        email: user.credential.email,
      },
    }));
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

  // ✅ Unblock user
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
}
