import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionOptionsController } from 'src/modules/quiz/question/option/question-option.controller';
import { QuestionOptionsService } from 'src/modules/quiz/question/option/question-option.service';

import { QuestionOption } from 'src/modules/quiz/question/option/entities/question-option.entity';
import { Question } from 'src/modules/quiz/question/entities/question.entity';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { QuizAttempt } from 'src/modules/quiz/attempt/entities/quiz-attempt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionOption, Question, Quiz, QuizAttempt]),
  ],
  controllers: [QuestionOptionsController],
  providers: [QuestionOptionsService],
  exports: [QuestionOptionsService],
})
export class QuestionOptionsModule {}
