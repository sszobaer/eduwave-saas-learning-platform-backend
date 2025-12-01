import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionsService } from 'src/services/questions.service';
import { CreateQuestionDto } from 'src/dtos/Quiz/create-question.dto';
import { UpdateQuestionDto } from 'src/dtos/Quiz/update-question.dto';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  
  @Post('quizzes/:quizId/questions')
  createForQuiz(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    
    createQuestionDto.quizId = quizId;
    return this.questionsService.create(createQuestionDto);
  }

  // Get all questions for a quiz
  @Get('quizzes/:quizId/questions')
  findByQuiz(@Param('quizId', ParseIntPipe) quizId: number) {
    return this.questionsService.findByQuiz(quizId);
  }

  // Get single question
  @Get('questions/:questionId')
  findOne(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.questionsService.findOne(questionId);
  }

  // Update question
  @Patch('questions/:questionId')
  update(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(questionId, updateQuestionDto);
  }

  // Delete question
  @Delete('questions/:questionId')
  remove(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.questionsService.remove(questionId);
  }
}
