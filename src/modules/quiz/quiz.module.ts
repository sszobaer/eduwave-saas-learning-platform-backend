import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizzesController } from 'src/modules/quiz/quiz.controller';
import { QuizzesService } from 'src/modules/quiz/quiz.service';

import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { QuizAttempt } from 'src/modules/quiz/attempt/entities/quiz-attempt.entity';
import { Question } from 'src/modules/quiz/question/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Course, QuizAttempt, Question]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],   // Export if needed elsewhere
})
export class QuizzesModule {}
