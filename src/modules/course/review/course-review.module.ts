import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseReview } from 'src/modules/course/review/entities/course-review.entity';
import { CourseReviewService } from 'src/modules/course/review/course-review.service';
import { CourseReviewController } from 'src/modules/course/review/course-review.controller';
import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Course } from 'src/modules/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseReview, Enrollment, User, Course])],
  controllers: [CourseReviewController],
  providers: [CourseReviewService],
})
export class CourseReviewModule {}
