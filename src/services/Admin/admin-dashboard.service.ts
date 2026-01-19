import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';
import { CourseReview } from 'src/entities/course-review.entity';
import { CourseTagMapping } from 'src/entities/course-tags-mapping';
import { Payment } from 'src/entities/payment.entity';
import { Enrollment } from 'src/entities/enrollment.entity';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(CourseReview)
    private readonly reviewRepo: Repository<CourseReview>,

    @InjectRepository(CourseTagMapping)
    private readonly courseTagRepo: Repository<CourseTagMapping>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}


  async getSummaryStats() {
    const totalUsers = await this.userRepo.count();
    const activeUsers = await this.userRepo.count({
      where: { isActive: true },
    });
    const totalCourses = await this.courseRepo.count();
    const totalEnrollments = await this.enrollmentRepo.count();

    return {
      totalUsers,
      activeUsers,
      blockedUsers: totalUsers - activeUsers,
      totalCourses,
      totalEnrollments,
    };
  }

  async getUserGrowthMonthly() {
    return this.userRepo
      .createQueryBuilder('u')
      .select(`DATE_TRUNC('month', u.created_at)`, 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getUserStatusDistribution() {
    const active = await this.userRepo.count({ where: { isActive: true } });
    const total = await this.userRepo.count();

    return [
      { name: 'Active', value: active },
      { name: 'Blocked', value: total - active },
    ];
  }

  async getCourseCreationTrend() {
    return this.courseRepo
      .createQueryBuilder('c')
      .select(`DATE_TRUNC('month', c.created_at)`, 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getCoursesByTag() {
    return this.courseTagRepo
      .createQueryBuilder('mapping')
      .leftJoin('mapping.tag', 'tag')
      .leftJoin('mapping.course', 'course')
      .select('tag.tag_name', 'tag')
      .addSelect('COUNT(course.course_id)', 'count')
      .groupBy('tag.tag_name')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  async getTopEnrolledCourses(limit = 5) {
    return this.courseRepo
      .createQueryBuilder('course')
      .leftJoin('course.enrollments', 'enrollment')
      .select('course.title', 'title')
      .addSelect('COUNT(enrollment.enrollment_id)', 'enrollments')
      .groupBy('course.course_id')
      .orderBy('enrollments', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getMonthlyRevenue() {
    return this.paymentRepo
      .createQueryBuilder('p')
      .select(`DATE_TRUNC('month', p.created_at)`, 'month')
      .addSelect('SUM(p.amount)', 'revenue')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getRatingDistribution() {
    return this.reviewRepo
      .createQueryBuilder('r')
      .select('r.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .groupBy('r.rating')
      .orderBy('r.rating', 'ASC')
      .getRawMany();
  }

async getTopRatedCourses(limit = 5) {
  return this.courseRepo
    .createQueryBuilder('course')
    .leftJoin('course.reviews', 'review')
    .select('course.title', 'title')
    .addSelect('AVG(review.rating)', 'avg_rating')  
    .groupBy('course.course_id')
    .having('COUNT(review.review_id) > 0')
    .orderBy('avg_rating', 'DESC')                 
    .limit(limit)
    .getRawMany();
}




  async getTopInstructors(limit = 5) {
    return this.userRepo
      .createQueryBuilder('u')
      .leftJoin('u.created_courses', 'course')
      .select('u.full_name', 'instructor')
      .addSelect('COUNT(course.course_id)', 'courses')
      .groupBy('u.user_id')
      .orderBy('courses', 'DESC')
      .limit(limit)
      .getRawMany();
  }


  async getAdminDashboardData() {
    return {
      summary: await this.getSummaryStats(),
      users: {
        growth: await this.getUserGrowthMonthly(),
        status: await this.getUserStatusDistribution(),
      },
      courses: {
        creationTrend: await this.getCourseCreationTrend(),
        byTag: await this.getCoursesByTag(),
        topEnrolled: await this.getTopEnrolledCourses(),
      },
      revenue: {
        monthly: await this.getMonthlyRevenue(),
      },
      reviews: {
        ratings: await this.getRatingDistribution(),
        topRatedCourses: await this.getTopRatedCourses(),
      },
      instructors: {
        top: await this.getTopInstructors(),
      },
    };
  }
}
