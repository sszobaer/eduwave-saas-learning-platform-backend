// src/enrollment/enrollment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import { EnrollmentService } from 'src/modules/enrollment/enrollment.service';
import { EnrollmentController } from 'src/modules/enrollment/enrollment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, User, Course, Payment])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
