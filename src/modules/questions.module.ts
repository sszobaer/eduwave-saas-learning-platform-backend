import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionsController } from 'src/controllers/questions.controller';
import { QuestionsService } from 'src/services/questions.service';

import { Question } from 'src/entities/question.entity';
import { Quiz } from 'src/entities/quiz.entity';
import { QuizAttempt } from 'src/entities/quiz-attempt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Quiz, QuizAttempt]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
