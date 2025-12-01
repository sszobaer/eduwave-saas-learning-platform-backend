import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizAttemptsController } from 'src/controllers/quiz-attempts.controller';
import { QuizAttemptsService } from 'src/services/quiz-attempts.service';

import { QuizAttempt } from 'src/entities/quiz-attempt.entity';
import { Quiz } from 'src/entities/quiz.entity';
import { Question } from 'src/entities/question.entity';
import { QuizAttemptAnswer } from 'src/entities/quiz-attempt-answer.entity';
import { QuestionOption } from 'src/entities/question-option.entity';
import { User } from 'src/entities/user.entity';
import { UserCredential } from 'src/entities/user-credentital.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizAttempt,
      Quiz,
      Question,
      QuizAttemptAnswer,
      QuestionOption,
      User,
      UserCredential
    ]),
  ],
  controllers: [QuizAttemptsController],
  providers: [QuizAttemptsService],
  exports: [QuizAttemptsService],
})
export class QuizAttemptsModule {}
