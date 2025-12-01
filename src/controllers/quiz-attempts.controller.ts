import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuizAttemptsService } from 'src/services/quiz-attempts.service';
import { CreateQuizAttemptDto } from 'src/dtos/Quiz/create-quiz-attempt.dto';
import { UpdateQuizAttemptDto } from 'src/dtos/Quiz/update-quiz-attempt.dto';

@Controller('quiz-attempts')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class QuizAttemptsController {
  constructor(private readonly quizAttemptsService: QuizAttemptsService) {}

  
  @Post('/quizzes/:quizId/start')
  startAttemptForQuiz(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Body() body: { studentUserId: number },
  ) {
    const dto: CreateQuizAttemptDto = {
      quizId,
      studentUserId: body.studentUserId,
    };
    return this.quizAttemptsService.startAttempt(dto);
  }

  
  @Get('by-quiz/:quizId')
  findByQuiz(@Param('quizId', ParseIntPipe) quizId: number) {
    return this.quizAttemptsService.findByQuiz(quizId);
  }

  //Get all attempts for a student (own dashboard or teacher view).
  @Get('by-student/:studentUserId')
  findByStudent(
    @Param('studentUserId', ParseIntPipe) studentUserId: number,
    @Query('quizId') quizId?: number,
  ) {
    return this.quizAttemptsService.findByStudent({
      studentUserId,
      quizId,
    });
  }

  @Get(':attemptId')
  findOne(@Param('attemptId', ParseIntPipe) attemptId: number) {
    return this.quizAttemptsService.findOne(attemptId);
  }


  @Patch(':attemptId')
  update(
    @Param('attemptId', ParseIntPipe) attemptId: number,
    @Body() updateAttemptDto: UpdateQuizAttemptDto,
  ) {
    return this.quizAttemptsService.update(attemptId, updateAttemptDto);
  }

  /**
   * Complete an attempt (submit and auto-grade).
   *  - validate timeLimit
   *  - calculate obtainedMarks and maxMarks
   *  - set status = COMPLETED
   */
  @Patch(':attemptId/complete')
  complete(@Param('attemptId', ParseIntPipe) attemptId: number) {
    return this.quizAttemptsService.completeAttempt(attemptId);
  }

  /**
   * Cancel an attempt (student quits).
   */
  @Patch(':attemptId/cancel')
  cancel(@Param('attemptId', ParseIntPipe) attemptId: number) {
    return this.quizAttemptsService.cancelAttempt(attemptId);
  }
}
