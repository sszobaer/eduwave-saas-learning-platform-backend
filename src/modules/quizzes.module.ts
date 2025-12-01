import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizzesController } from 'src/controllers/quizzes.controller';
import { QuizzesService } from 'src/services/quizzes.service';

import { Quiz } from 'src/entities/quiz.entity';
import { Course } from 'src/entities/course.entity';
import { QuizAttempt } from 'src/entities/quiz-attempt.entity';
import { Question } from 'src/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Course, QuizAttempt, Question]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],   // Export if needed elsewhere
})
export class QuizzesModule {}
