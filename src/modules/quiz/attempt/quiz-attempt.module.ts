import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizAttemptsController } from 'src/modules/quiz/attempt/quiz-attempt.controller';
import { QuizAttemptsService } from 'src/modules/quiz/attempt/quiz-attempt.service';

import { QuizAttempt } from 'src/modules/quiz/attempt/entities/quiz-attempt.entity';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { Question } from 'src/modules/quiz/question/entities/question.entity';
import { QuizAttemptAnswer } from 'src/modules/quiz/attempt/answer/entities/quiz-attempt-answer.entity';
import { QuestionOption } from 'src/modules/quiz/question/option/entities/question-option.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { UserCredential } from 'src/modules/auth/entities/user-credentital.entity';


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
