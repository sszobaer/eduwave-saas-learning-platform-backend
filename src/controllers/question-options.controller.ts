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
import { QuestionOptionsService } from 'src/services/question-options.service';
import { CreateQuestionOptionDto } from 'src/dtos/Quiz/create-question-option.dto';
import { UpdateQuestionOptionDto } from 'src/dtos/Quiz/update-question-option.dto';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class QuestionOptionsController {
  constructor(
    private readonly questionOptionsService: QuestionOptionsService,
  ) {}

  // Create option for a question
  @Post('questions/:questionId/options')
  createForQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() createOptionDto: CreateQuestionOptionDto,
  ) {
    createOptionDto.questionId = questionId;
    return this.questionOptionsService.create(createOptionDto);
  }

  // Get all options for a question
  @Get('questions/:questionId/options')
  findByQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.questionOptionsService.findByQuestion(questionId);
  }

  // Get single option
  @Get('question-options/:optionId')
  findOne(@Param('optionId', ParseIntPipe) optionId: number) {
    return this.questionOptionsService.findOne(optionId);
  }

  // Update option
  @Patch('question-options/:optionId')
  update(
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() updateOptionDto: UpdateQuestionOptionDto,
  ) {
    return this.questionOptionsService.update(optionId, updateOptionDto);
  }

  // Delete option
  @Delete('question-options/:optionId')
  remove(@Param('optionId', ParseIntPipe) optionId: number) {
    return this.questionOptionsService.remove(optionId);
  }
}
