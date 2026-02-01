import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { QuizzesModule } from './modules/quiz/quiz.module';
import { QuizAttemptsModule } from './modules/quiz/attempt/quiz-attempt.module';
import { QuizAttemptAnswersModule } from './modules/quiz/attempt/answer/quiz-attempt-answer.module';
import { QuestionsModule } from './modules/quiz/question/question.module';
import { QuestionOptionsModule } from './modules/quiz/question/option/question-option.module';
import { CourseModule } from './modules/course/course.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { LectureModule } from './modules/lecture/lecture.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { AdminDashboardModule } from './modules/admin/admin.module';
import { TeacherModule} from "./modules/teacher/teacher.module";
import { CourseReviewModule } from './modules/course/review/course-review.module';

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
