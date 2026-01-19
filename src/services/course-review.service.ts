import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseReview } from 'src/entities/course-review.entity';
import { CreateCourseReviewDto } from 'src/dtos/CourseReview/create-course-review.dto';
import { Enrollment } from 'src/entities/enrollment.entity';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';

@Injectable()
export class CourseReviewService {
  constructor(
    @InjectRepository(CourseReview)
    private readonly courseReviewRepo: Repository<CourseReview>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  // Check if the user is enrolled in the course
  private async isUserEnrolledInCourse(user_id: number, course_id: number): Promise<boolean> {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { student: { user_id }, course: { course_id } },
    });
    return !!enrollment;
  }

  // Create a course review
  async createReview(dto: CreateCourseReviewDto): Promise<CourseReview> {
    const { user_id, course_id, comment, rating } = dto;

    const user = await this.userRepo.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }

    const course = await this.courseRepo.findOne({ where: { course_id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${course_id} not found`);
    }

    // Check if the user is enrolled in the course
    const isEnrolled = await this.isUserEnrolledInCourse(user_id, course_id);
    if (!isEnrolled) {
      throw new BadRequestException('User is not enrolled in the course');
    }

    const review = new CourseReview();
    review.user = user;
    review.course = course;
    review.comment = comment;
    review.rating = rating;

    return this.courseReviewRepo.save(review);
  }


  async getAllReviews(): Promise<CourseReview[]> {
    return this.courseReviewRepo.find({
      relations: ['user', 'course'], // Include both user and course details
      order: { created_at: 'DESC' }, // Optional: Sort by review creation date
    });
  }
  
  async getCourseReviews(course_id: number): Promise<CourseReview[]> {
    const course = await this.courseRepo.findOne({
      where: { course_id },
    });
    if (!course) {
      throw new NotFoundException(`Course with id ${course_id} not found`);
    }

    return this.courseReviewRepo.find({
      where: { course: { course_id } },
      relations: ['user'], // Optionally, include user details for each review
      order: { created_at: 'DESC' }, // Optional: Sort reviews by creation date
    });
  }
}
