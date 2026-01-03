// src/enrollment/enrollment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from 'src/entities/enrollment.entity';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';
import { Payment } from 'src/entities/payment.entity';
import { EnrollmentService } from 'src/services/enrollment.service';
import { EnrollmentController } from 'src/controllers/enrollment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, User, Course, Payment])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
