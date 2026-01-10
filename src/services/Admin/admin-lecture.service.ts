import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecture } from 'src/entities/lecture.entity';

@Injectable()
export class AdminLectureService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepo: Repository<Lecture>,
  ) {}

  getAllLectures() {
    return this.lectureRepo.find({
      relations: ['course'],
    });
  }

  async deleteLecture(id: number) {
    const lecture = await this.lectureRepo.findOne({
      where: { lecture_id: id },
    });

    if (!lecture) throw new NotFoundException('Lecture not found');

    await this.lectureRepo.remove(lecture);
    return { message: 'Lecture deleted' };
  }
}
