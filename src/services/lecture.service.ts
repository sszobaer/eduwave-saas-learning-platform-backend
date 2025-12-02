// lecture/lecture.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecture } from 'src/entities/lecture.entity';
import { Course } from 'src/entities/course.entity';
import { User } from 'src/entities/user.entity';
import { CreateLectureDto } from 'src/dtos/Lecture/create-lecture.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture) private readonly lectureRepo: Repository<Lecture>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createLecture(dto: CreateLectureDto, userId: number) {
    const course = await this.courseRepo.findOne({ where: { course_id: dto.course_id } });
    if (!course) throw new NotFoundException('Course not found');

    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const lecture = this.lectureRepo.create({
      title: dto.title,
      video_link: dto.video_link,
      course,
      created_by_user: user,
    });

    return this.lectureRepo.save(lecture);
  }

  async getLectureById(id: number) {
    const lecture = await this.lectureRepo.findOne({
      where: { lecture_id: id },
      relations: ['course', 'created_by_user'],
    });
    if (!lecture) throw new NotFoundException('Lecture not found');
    return lecture;
  }

  async getAllLectures() {
    return this.lectureRepo.find({ relations: ['course', 'created_by_user'] });
  }

  async updateLecture(id: number, dto: Partial<CreateLectureDto>) {
    const lecture = await this.lectureRepo.findOne({ where: { lecture_id: id } });
    if (!lecture) throw new NotFoundException('Lecture not found');

    Object.assign(lecture, dto);
    return this.lectureRepo.save(lecture);
  }

  async deleteLecture(id: number) {
    const result = await this.lectureRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Lecture not found');
    return { message: 'Lecture deleted successfully' };
  }
}
