import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecture } from 'src/entities/lecture.entity';
import { Course } from 'src/entities/course.entity';
import { User } from 'src/entities/user.entity';
import { CreateLectureDto } from 'src/dtos/Lecture/create-lecture.dto';
import { UpdateLectureDto } from 'src/dtos/Lecture/update-lecture.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepo: Repository<Lecture>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}


  async createLecture(dto: CreateLectureDto, userId: number) {
    const course = await this.courseRepo.findOne({
      where: {
        course_id: dto.course_id,
        created_by_user: { user_id: userId },
      },
      relations: ['created_by_user'],
    });

    if (!course) {
      throw new ForbiddenException('You are not allowed to add lecture to this course');
    }

    const lecture = this.lectureRepo.create({
      title: dto.title,
      video_link: dto.lecture_video,
      course,
      created_by_user: { user_id: userId } as User,
    });

    return this.lectureRepo.save(lecture);
  }


  async getLectureById(lectureId: number, userId: number) {
    const lecture = await this.lectureRepo.findOne({
      where: {
        lecture_id: lectureId,
        created_by_user: { user_id: userId },
      },
      relations: ['course', 'created_by_user'],
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found or access denied');
    }

    return lecture;
  }


  async getAllLectures(userId: number) {
    return this.lectureRepo.find({
      where: {
        created_by_user: { user_id: userId },
      },
      relations: ['course'],
      order: { lecture_id: 'DESC' },
    });
  }


  async updateLecture(
    lectureId: number,
    dto: UpdateLectureDto,
    userId: number,
  ) {
    const lecture = await this.lectureRepo.findOne({
      where: {
        lecture_id: lectureId,
        created_by_user: { user_id: userId },
      },
    });

    if (!lecture) {
      throw new ForbiddenException('You are not allowed to update this lecture');
    }

    Object.assign(lecture, dto);
    return this.lectureRepo.save(lecture);
  }


  async deleteLecture(lectureId: number, userId: number) {
    const lecture = await this.lectureRepo.findOne({
      where: {
        lecture_id: lectureId,
        created_by_user: { user_id: userId },
      },
    });

    if (!lecture) {
      throw new ForbiddenException('You are not allowed to delete this lecture');
    }

    await this.lectureRepo.remove(lecture);
    return { message: 'Lecture deleted successfully' };
  }
}
