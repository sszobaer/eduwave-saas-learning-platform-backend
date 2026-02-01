import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionsController } from 'src/modules/quiz/question/question.controller';
import { QuestionsService } from 'src/modules/quiz/question/question.service';

import { Question } from 'src/modules/quiz/question/entities/question.entity';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { QuizAttempt } from 'src/modules/quiz/attempt/entities/quiz-attempt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Quiz, QuizAttempt]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
