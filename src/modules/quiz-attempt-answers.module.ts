import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizAttemptAnswersController } from 'src/controllers/quiz-attempt-answers.controller';
import { QuizAttemptAnswersService } from 'src/services/quiz-attempt-answers.service';

import { QuizAttemptAnswer } from 'src/entities/quiz-attempt-answer.entity';
import { QuizAttempt } from 'src/entities/quiz-attempt.entity';
import { Question } from 'src/entities/question.entity';
import { QuestionOption } from 'src/entities/question-option.entity';

import { QuizAttemptsModule } from './quiz-attempts.module';

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
