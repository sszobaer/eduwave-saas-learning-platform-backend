// assignment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Assignment } from 'src/entities/assignment.entity';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';
import { Enrollment } from 'src/entities/enrollment.entity';
import { CreateAssignmentDto, UpdateAssignmentDto } from 'src/dtos/Assignment/assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from './email.service';

@Injectable()
export class AssignmentService {
  constructor(
  @InjectRepository(Assignment) private assignmentRepo: Repository<Assignment>,
  @InjectRepository(User) private userRepo: Repository<User>,
  @InjectRepository(Course) private courseRepo: Repository<Course>,
  @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
  private readonly emailService: EmailService,
) {}


  // Create assignment and send email to students
  async create(dto: CreateAssignmentDto) {
    const { course_id, teacher_id, title, description, due_date } = dto;

    // fetch teacher
    const teacher = await this.userRepo.findOne({ where: { user_id: teacher_id } });
    if (!teacher) {
        throw new NotFoundException("Teacher not found");
    }

    // fetch course
    const course = await this.courseRepo.findOne({ where: { course_id } });
    if (!course) {
        throw new NotFoundException("Course not found");
    }

    const assignment = this.assignmentRepo.create({
        title,
        description,
        due_date,
        created_by_user: teacher,
        course: course
    });

     const enrollments = await this.enrollmentRepo.find({
    where: { course: {course_id} },
    relations: ['student', 'student.credential'],
  });

    for (const enrollment of enrollments) {
    const student = enrollment.student;
    const email = student.credential.email;

    if(!email) throw new NotFoundException();
      

    await this.emailService.sendEmail({
      to: email,
      subject: `New Assignment: ${assignment.title}`,
      template: 'assignment',
            context: {
                name: enrollment.student.full_name,
                title: assignment.title,
                due_date: assignment.due_date
            },
    }).catch(err => console.error('Email sending failed:', err));
  }
    return await this.assignmentRepo.save(assignment);
}


  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepo.find({
      relations: ['course', 'created_by_user'],
    });
  }

  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepo.findOne({
      where: { assignment_id: id },
      relations: ['course', 'created_by_user', 'submissions'],
    });
    if (!assignment) throw new NotFoundException('Assignment not found');
    return assignment;
  }

  async update(id: number, dto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.findOne(id);
    if (dto.title) assignment.title = dto.title;
    if (dto.description) assignment.description = dto.description;
    if (dto.due_date) assignment.due_date = new Date(dto.due_date);
    if (dto.course_id) {
      const course = await this.courseRepo.findOne({ where: { course_id: dto.course_id } });
      if (!course) throw new NotFoundException('Course not found');
      assignment.course = course;
    }
    return this.assignmentRepo.save(assignment);
  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepo.remove(assignment);
  }
}
