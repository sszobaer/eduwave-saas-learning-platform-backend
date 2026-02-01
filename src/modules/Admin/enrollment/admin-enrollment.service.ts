import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity';

@Injectable()
export class AdminEnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  getAllEnrollments() {
    return this.enrollmentRepo.find({
      relations: ['user', 'course'],
    });
  }
}
