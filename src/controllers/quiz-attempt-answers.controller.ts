import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuizAttemptAnswersService } from 'src/services/quiz-attempt-answers.service';
import { CreateQuizAttemptAnswerDto } from 'src/dtos/Quiz/create-quiz-attempt-answer.dto';
import { UpdateQuizAttemptAnswerDto } from 'src/dtos/Quiz/update-quiz-attempt-answer.dto';

@Controller('quiz-attempt-answers')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class QuizAttemptAnswersController {
  constructor(
    private readonly quizAttemptAnswersService: QuizAttemptAnswersService,
  ) {}

  /*
  Submit one answer for an attempt (single question).
  Body: { questionId, optionId }
  */
  @Post('/quiz-attempts/:attemptId/answers')
  submitSingleAnswer(
    @Param('attemptId', ParseIntPipe) attemptId: number,
    @Body()
    body: {
      questionId: number;
      optionId: number;
    },
  ) {
    const dto: CreateQuizAttemptAnswerDto = {
      quizAttemptId: attemptId,
      questionId: body.questionId,
      optionId: body.optionId,
    };
    return this.quizAttemptAnswersService.submitOrUpdateAnswer(dto);
  }

  /*
  Submit multiple answers for an attempt (bulk).
  Body: { answers: { questionId, optionId }[] }
  */
  @Post('/quiz-attempts/:attemptId/answers/bulk')
  submitBulkAnswers(
    @Param('attemptId', ParseIntPipe) attemptId: number,
    @Body()
    body: {
      answers: { questionId: number; optionId: number }[];
    },
  ) {
    const dtos: CreateQuizAttemptAnswerDto[] = body.answers.map((a) => ({
      quizAttemptId: attemptId,
      questionId: a.questionId,
      optionId: a.optionId,
    }));

    return this.quizAttemptAnswersService.submitBulkAnswers(dtos);
  }

  /*
   Get all answers of an attempt (for review/analysis).
   */
  @Get('/quiz-attempts/:attemptId/answers')
  findByAttempt(@Param('attemptId', ParseIntPipe) attemptId: number) {
    return this.quizAttemptAnswersService.findByAttempt(attemptId);
  }

  /*
  Get a single answer record (rarely needed).
  */
  @Get(':answerId')
  findOne(@Param('answerId', ParseIntPipe) answerId: number) {
    return this.quizAttemptAnswersService.findOne(answerId);
  }

  /*
  Update a specific answer (if you allow changing answer before completion).
  */
  @Patch(':answerId')
  update(
    @Param('answerId', ParseIntPipe) answerId: number,
    @Body() updateDto: UpdateQuizAttemptAnswerDto,
  ) {
    return this.quizAttemptAnswersService.update(answerId, updateDto);
  }
}
