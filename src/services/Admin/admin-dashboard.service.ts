import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    private readonly dataSource: DataSource,
  ) {}


  async getDashboardStats() {
    const totalUsers = await this.userRepo.count();
    const activeUsers = await this.userRepo.count({
      where: { isActive: true },
    });
    const totalCourses = await this.courseRepo.count();

    return {
      totalUsers,
      activeUsers,
      blockedUsers: totalUsers - activeUsers,
      totalCourses
    };
  }
}
