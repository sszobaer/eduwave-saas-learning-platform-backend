import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentService } from 'src/services/assignment.service';
import { AssignmentController } from 'src/controllers/assignment.controller';
import { Assignment } from 'src/entities/assignment.entity';
import { AssignmentSubmission } from 'src/entities/assignment-submissions.entity';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';
import { Enrollment } from 'src/entities/enrollment.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assignment,
      AssignmentSubmission,
      User,
      Course,
      Enrollment,
    ]),
    MailerModule,
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
