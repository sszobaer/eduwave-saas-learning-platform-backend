import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from 'src/entities/enrollment.entity';
import {
  CreateEnrollmentDto,
  UpdateEnrollmentDto,
  SearchEnrollmentDto,
} from 'src/dtos/Enrollment/enrollment.dto';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';
import { Payment } from 'src/entities/payment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) { }

  async create(dto: CreateEnrollmentDto): Promise<Enrollment> {
    const { student_user_id, course_id, payment_id } = dto;

    const student = await this.userRepo.findOne({
      where: { user_id: student_user_id },
      relations: ['enrollments']
    });

    if (!student)
      throw new NotFoundException(
        `Student user with id ${student_user_id} not found`,
      );



    const course = await this.courseRepo.findOne({ where: { course_id } });
    if (!course)
      throw new NotFoundException(`Course with id ${course_id} not found`);

    const checkCourse = await this.enrollmentRepo.findOne({
      where: {
        course: {
          course_id: dto.course_id
        },
        student: {
          user_id: dto.student_user_id
        }
      },
      relations: ['course', 'student', 'payment']
    });
    if (checkCourse) throw new BadRequestException("Course already enrolled");

    let payment: Payment | null = null;
    if (typeof payment_id !== 'undefined' && payment_id !== null) {
      payment = await this.paymentRepo.findOne({ where: { payment_id } });
      if (!payment)
        throw new NotFoundException(`Payment with id ${payment_id} not found`);
      // Optional: validate payment.student and payment.course are the same as provided IDs
      if (
        payment.student &&
        (payment.student as any).user_id !== student_user_id
      ) {
        throw new BadRequestException(
          'Payment does not belong to the provided student',
        );
      }
      if (payment.course && (payment.course as any).course_id !== course_id) {
        throw new BadRequestException(
          'Payment does not belong to the provided course',
        );
      }
    }

    const enrollment = new Enrollment();
    enrollment.student = student;
    enrollment.course = course;
    enrollment.payment = payment ?? null;

    return this.enrollmentRepo.save(enrollment);
  }

  async findAll(search: SearchEnrollmentDto): Promise<Enrollment[]> {
    const where: any = {};

    if (search.student_user_id) {
      where.student = { user_id: search.student_user_id };
    }

    if (search.course_id) {
      where.course = { course_id: search.course_id };
    }

    if (search.payment_id) {
      where.payment = { payment_id: search.payment_id };
    }

    if (search.start_date || search.end_date) {
      where.enrolled_at = {};
      if (search.start_date) {
        where.enrolled_at['$gte'] = new Date(search.start_date);
      }
      if (search.end_date) {
        where.enrolled_at['$lte'] = new Date(search.end_date);
      }
    }

    return this.enrollmentRepo.find({
      relations: ['student', 'course', 'payment'],
      order: { enrolled_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { enrollment_id: id },
      relations: ['student', 'course', 'payment'],
    });
    if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
    return enrollment;
  }

  // ✅ NEW METHOD: Get all enrollments for a specific student
  async getStudentEnrollments(studentUserId: number): Promise<Enrollment[]> {
    const enrollments = await this.enrollmentRepo.find({
      where: { student: { user_id: studentUserId } },
      relations: ['course', 'course.created_by_user', 'payment'],
      order: { enrolled_at: 'DESC' },
    });

    return enrollments;
  }

  async update(id: number, dto: UpdateEnrollmentDto): Promise<Enrollment> {
    const enrollment = await this.findOne(id);

    if (typeof dto.student_user_id !== 'undefined') {
      const student = await this.userRepo.findOne({
        where: { user_id: dto.student_user_id },
      });
      if (!student)
        throw new NotFoundException(
          `Student with id ${dto.student_user_id} not found`,
        );
      enrollment.student = student;
    }

    if (typeof dto.course_id !== 'undefined') {
      const course = await this.courseRepo.findOne({
        where: { course_id: dto.course_id },
      });
      if (!course)
        throw new NotFoundException(
          `Course with id ${dto.course_id} not found`,
        );
      enrollment.course = course;
    }

    if (typeof dto.payment_id !== 'undefined') {
      if (dto.payment_id === null) {
        enrollment.payment = null;
      } else {
        const payment = await this.paymentRepo.findOne({
          where: { payment_id: dto.payment_id },
        });
        if (!payment)
          throw new NotFoundException(
            `Payment with id ${dto.payment_id} not found`,
          );
        enrollment.payment = payment;
      }
    }

    if (typeof dto.enrolled_at !== 'undefined') {
      enrollment.enrolled_at = new Date(dto.enrolled_at);
    }

    return this.enrollmentRepo.save(enrollment);
  }

  async patch(id: number, dto: UpdateEnrollmentDto): Promise<Enrollment> {
    return this.update(id, dto);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const enrollment = await this.findOne(id);
    await this.enrollmentRepo.remove(enrollment);
    return { deleted: true };
  }
}
