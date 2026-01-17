import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseReview } from 'src/entities/course-review.entity';
import { CourseReviewService } from 'src/services/course-review.service';
import { CourseReviewController } from 'src/controllers/course-review.controller';
import { Enrollment } from 'src/entities/enrollment.entity';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseReview, Enrollment, User, Course])],
  controllers: [CourseReviewController],
  providers: [CourseReviewService],
})
export class CourseReviewModule {}
