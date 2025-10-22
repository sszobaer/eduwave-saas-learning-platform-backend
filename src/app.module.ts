import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { CoursesModule } from './courses/courses.module';
import { CourseTagsModule } from './course_tags/course_tags.module';
import { EnrollementsModule } from './enrollements/enrollements.module';
import { LecturesModule } from './lectures/lectures.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AssignmentsSubmissionsModule } from './assignments_submissions/assignments_submissions.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuizSubmissionsModule } from './quiz_submissions/quiz_submissions.module';
import { QuizQuestionsModule } from './quiz_questions/quiz_questions.module';
import { PaymentsModule } from './payments/payments.module';
import { CertificartesModule } from './certificartes/certificartes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FileStorageModule } from './file_storage/file_storage.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, UsersModule, RolesModule, OrganizationsModule, CoursesModule, CourseTagsModule, EnrollementsModule, LecturesModule, AttendanceModule, AssignmentsModule, AssignmentsSubmissionsModule, QuizzesModule, QuizSubmissionsModule, QuizQuestionsModule, PaymentsModule, CertificartesModule, NotificationsModule, FileStorageModule, ReviewsModule, ChatModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
