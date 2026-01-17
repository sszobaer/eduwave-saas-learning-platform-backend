import { Module } from '@nestjs/common';
import { TeacherDashboardController } from '../../controllers/Teacher/teacher-dashboard.controller';
import { TeacherDashboardService } from '../../services/Teacher/teacher-dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';
import { AuthModule } from '../auth.module';
import { Enrollment } from 'src/entities/enrollment.entity'; // Import Enrollment Entity
import { Payment } from 'src/entities/payment.entity';
import { Quiz } from 'src/entities/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, Enrollment, Payment, Quiz]),AuthModule],
  controllers: [TeacherDashboardController],
  providers: [TeacherDashboardService],
})
export class TeacherModule {}
