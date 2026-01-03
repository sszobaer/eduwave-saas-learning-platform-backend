// assignment-submission.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AssignmentSubmission } from 'src/entities/assignment-submissions.entity';
import { Assignment } from 'src/entities/assignment.entity';
import { User } from 'src/entities/user.entity';
import {
  CreateSubmissionDto,
  UpdateSubmissionDto,
} from 'src/dtos/Assignment/assignment-submission.dto';

@Injectable()
export class AssignmentSubmissionService {
  constructor(
    @Inject('ASSIGNMENT_SUBMISSION_REPO')
    private submissionRepo: Repository<AssignmentSubmission>,
    @Inject('ASSIGNMENT_REPO') private assignmentRepo: Repository<Assignment>,
    @Inject('USER_REPO') private userRepo: Repository<User>,
  ) {}

  async create(
    dto: CreateSubmissionDto,
    student: User,
  ): Promise<AssignmentSubmission> {
    const assignment = await this.assignmentRepo.findOne({
      where: { assignment_id: dto.assignment_id },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const submission = new AssignmentSubmission();
    submission.assignment = assignment;
    submission.student = student;
    submission.submission_url = dto.submission_url;
    submission.submitted_at = new Date(dto.submitted_at);

    return this.submissionRepo.save(submission);
  }

  async findAll(): Promise<AssignmentSubmission[]> {
    return this.submissionRepo.find({ relations: ['assignment', 'student'] });
  }

  async findOne(id: number): Promise<AssignmentSubmission> {
    const submission = await this.submissionRepo.findOne({
      where: { assignment_submission_id: id },
      relations: ['assignment', 'student'],
    });
    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  async update(
    id: number,
    dto: UpdateSubmissionDto,
  ): Promise<AssignmentSubmission> {
    const submission = await this.findOne(id);
    if (dto.submission_url) submission.submission_url = dto.submission_url;
    if (dto.submitted_at) submission.submitted_at = new Date(dto.submitted_at);
    if (dto.marks !== undefined) submission.marks = dto.marks;
    if (dto.feedback) submission.feedback = dto.feedback;
    return this.submissionRepo.save(submission);
  }

  async remove(id: number): Promise<void> {
    const submission = await this.findOne(id);
    await this.submissionRepo.remove(submission);
  }
}
