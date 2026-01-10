import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/entities/course.entity';
import { UpdateCourseDto } from 'src/dtos/Course/update-course.dto';

@Injectable()
export class AdminCourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  getAllCourses() {
    return this.courseRepo.find({
        relations: ['created_by_user', 'lectures'],
      order: { course_id: 'DESC' }
    });
  }

  async getCourseById(id: number) {
    const course = await this.courseRepo.findOne({
      where: { course_id: id },
      relations: ['lectures','created_by_user'],
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async updateCourse(id: number, dto: UpdateCourseDto) {
    const course = await this.courseRepo.findOne({
      where: { course_id: id },
    });

    if (!course) throw new NotFoundException('Course not found');

    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }

  async deleteCourse(id: number) {
    const course = await this.courseRepo.findOne({
      where: { course_id: id },
    });

    if (!course) throw new NotFoundException('Course not found');

    await this.courseRepo.remove(course);
    return { message: 'Course deleted successfully' };
  }
}
