import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/user.module';
import { RolesModule } from './modules/roles.module';
import { OrganizationsModule } from './modules/organizations.module';
import { CoursesModule } from './modules/courses.module';
import { CourseTagsModule } from './modules/course_tags.module';
import { EnrollementsModule } from './modules/enrollements.module';
import { LecturesModule } from './modules/lectures.module';
import { AttendanceModule } from './modules/attendance.module';
import { AssignmentsModule } from './modules/assignments.module';
import { AssignmentsSubmissionsModule } from './modules/assignments_submissions.module';
import { QuizzesModule } from './modules/quizzes.module';
import { QuizSubmissionsModule } from './modules/quiz_submissions.module';
import { QuizQuestionsModule } from './modules/quiz_questions.module';
import { PaymentsModule } from './modules/payments.module';
import { CertificartesModule } from './modules/certificartes.module';
import { NotificationsModule } from './modules/notifications.module';
import { FileStorageModule } from './modules/file_storage.module';
import { ReviewsModule } from './modules/reviews.module';
import { ChatModule } from './modules/chat.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, UsersModule, RolesModule, OrganizationsModule, CoursesModule, CourseTagsModule, EnrollementsModule, LecturesModule, AttendanceModule, AssignmentsModule, AssignmentsSubmissionsModule, QuizzesModule, QuizSubmissionsModule, QuizQuestionsModule, PaymentsModule, CertificartesModule, NotificationsModule, FileStorageModule, ReviewsModule, ChatModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
