import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';
import { RoleModule } from './modules/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { EmailModule } from './modules/email.module';
import { QuizzesModule } from './modules/quizzes.module';
import { QuizAttemptsModule } from './modules/quiz-attempts.module';
import { QuizAttemptAnswersModule } from './modules/quiz-attempt-answers.module';
import { QuestionsModule } from './modules/questions.module';
import { QuestionOptionsModule } from './modules/question-options.module';
import { CourseModule } from './modules/course.module';
import { EnrollmentModule } from './modules/enrollment.module';
import { LectureModule } from './modules/lecture.module';
import { PaymentModule } from './modules/payment.module';
import { AssignmentModule } from './modules/assignment.module';
import { AdminDashboardModule } from './modules/Admin/admin.module';
import { TeacherModule} from "./modules/Teacher/teacher.module";
import { CourseReviewModule } from './modules/course-review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
        extra: { 
          max: 10,
        }
      }),
    }),
    AuthModule,
    UserModule,
    RoleModule,
    EmailModule,
    QuizzesModule,
    QuizAttemptsModule,
    QuizAttemptAnswersModule,
    QuestionsModule,
    QuestionOptionsModule,
    CourseModule,
    EnrollmentModule,
    LectureModule,
    PaymentModule,
    AssignmentModule,
    AdminDashboardModule,
    TeacherModule,
    CourseReviewModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
