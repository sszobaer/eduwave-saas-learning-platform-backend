import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionOptionsController } from 'src/controllers/question-options.controller';
import { QuestionOptionsService } from 'src/services/question-options.service';

import { QuestionOption } from 'src/entities/question-option.entity';
import { Question } from 'src/entities/question.entity';
import { Quiz } from 'src/entities/quiz.entity';
import { QuizAttempt } from 'src/entities/quiz-attempt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionOption, Question, Quiz, QuizAttempt]),
  ],
  controllers: [QuestionOptionsController],
  providers: [QuestionOptionsService],
  exports: [QuestionOptionsService],
})
export class QuestionOptionsModule {}
