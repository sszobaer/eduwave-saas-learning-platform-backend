import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizAttemptAnswersController } from 'src/modules/quiz/attempt/answer/quiz-attempt-answer.controller';
import { QuizAttemptAnswersService } from 'src/modules/quiz/attempt/answer/quiz-attempt-answer.service';

import { QuizAttemptAnswer } from 'src/modules/quiz/attempt/answer/entities/quiz-attempt-answer.entity';
import { QuizAttempt } from 'src/modules/quiz/attempt/entities/quiz-attempt.entity';
import { Question } from 'src/modules/quiz/question/entities/question.entity';
import { QuestionOption } from 'src/modules/quiz/question/option/entities/question-option.entity';

import { QuizAttemptsModule } from '../quiz-attempt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizAttemptAnswer,
      QuizAttempt,
      Question,
      QuestionOption,
    ]),
    forwardRef(() => QuizAttemptsModule),  // 🔥 fix circular dependency
  ],
  controllers: [QuizAttemptAnswersController],
  providers: [QuizAttemptAnswersService],
  exports: [QuizAttemptAnswersService],
})
export class QuizAttemptAnswersModule {}
