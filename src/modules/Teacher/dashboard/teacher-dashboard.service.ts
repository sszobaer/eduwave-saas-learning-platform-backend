import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity'; // Assuming Enrollment Entity exists
import { Payment } from 'src/modules/payment/entities/payment.entity';  // Assuming Payment Entity exists
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';

@Injectable()
export class TeacherDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
  ) {}


  async getDashboardStats(teacherId: number) {

    const totalCourses = await this.courseRepo.count({
      where: { created_by_user: { user_id: teacherId } },
    });

    const totalStudentsEnrolled = await this.enrollmentRepo.count({
      where: { course: { created_by_user: { user_id: teacherId } } },
    });

    const totalEarnings = await this.paymentRepo
      .createQueryBuilder('payment')
      .innerJoin('payment.course', 'course')
      .where('course.created_by_user = :teacherId', { teacherId })
      .select('SUM(payment.amount)', 'totalEarnings')
      .getRawOne();

    const activeQuizzes = await this.quizRepo.count({
      where: { course: { created_by_user: { user_id: teacherId } }, isPublished: true },
    });

    return {
      totalCourses,
      totalStudentsEnrolled,
      totalEarnings: totalEarnings?.totalEarnings || 0,
      activeQuizzes,
    };
  }
}
