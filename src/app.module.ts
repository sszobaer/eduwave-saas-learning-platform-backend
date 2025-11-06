import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { RoleModule } from './modules/role.module';
import { OrganizationModule } from './modules/organization.module';
import { CoursesModule } from './modules/courses.module';
import { CourseTagsModule } from './modules/course_tags.module';
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
import { AdminModule } from './modules/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
    }),
  }),
    AuthModule, 
    UserModule, 
    RoleModule, 
    OrganizationModule, 
    CoursesModule, 
    CourseTagsModule, 
    LecturesModule, 
    AttendanceModule, 
    AssignmentsModule, 
    AssignmentsSubmissionsModule, 
    QuizzesModule, 
    QuizSubmissionsModule, 
    QuizQuestionsModule, 
    PaymentsModule, 
    CertificartesModule, 
    NotificationsModule, 
    FileStorageModule, 
    ReviewsModule, 
    ChatModule, 
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
