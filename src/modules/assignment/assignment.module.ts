import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentService } from 'src/modules/assignment/assignment.service';
import { AssignmentController } from 'src/modules/assignment/assignment.controller';
import { Assignment } from 'src/modules/assignment/entities/assignment.entity';
import { AssignmentSubmission } from 'src/modules/assignment/submission/entities/assignment-submissions.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity';
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
