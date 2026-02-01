import { Controller, Post, Body, Get, Param, ValidationPipe } from '@nestjs/common';
import { CourseReviewService } from 'src/modules/course/review/course-review.service';
import { CreateCourseReviewDto } from 'src/modules/course/review/dto/create-course-review.dto';

@Controller('course-reviews')
export class CourseReviewController {
  constructor(private readonly courseReviewService: CourseReviewService) {}

  // Endpoint to create a review
  @Post()
  async create(@Body(ValidationPipe) dto: CreateCourseReviewDto) {
    return await this.courseReviewService.createReview(dto);
  }

  // Endpoint to get reviews for a course
  @Get('course/:course_id')
  async getCourseReviews(@Param('course_id') course_id: number) {
    return await this.courseReviewService.getCourseReviews(course_id);
  }

  @Get()
  async getAllReviews() {
    return await this.courseReviewService.getAllReviews();
  }
}
