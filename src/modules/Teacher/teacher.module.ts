import { Module } from '@nestjs/common';
import { TeacherDashboardController } from './dashboard/teacher-dashboard.controller';
import { TeacherDashboardService } from './dashboard/teacher-dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { AuthModule } from '../auth/auth.module';
import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity'; // Import Enrollment Entity
import { Payment } from 'src/modules/payment/entities/payment.entity';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, Enrollment, Payment, Quiz]),AuthModule],
  controllers: [TeacherDashboardController],
  providers: [TeacherDashboardService],
})
export class TeacherModule {}
