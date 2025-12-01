import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuizzesService } from 'src/services/quizzes.service';
import { CreateQuizDto } from 'src/dtos/Quiz/create-quiz.dto';
import { UpdateQuizDto } from 'src/dtos/Quiz/update-quiz.dto';

@Controller('quizzes')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  // Create a quiz
  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  // List quizzes (optionally filter by courseId, isPublished)
  @Get()
  findAll(
    @Query('courseId') courseId?: number,
    @Query('isPublished') isPublished?: 'true' | 'false',
  ) {
    const isPublishedBool =
      isPublished === undefined ? undefined : isPublished === 'true';
    return this.quizzesService.findAll({ courseId, isPublished: isPublishedBool });
  }

  // Get quiz by ID
  @Get(':quizId')
  findOne(@Param('quizId', ParseIntPipe) quizId: number) {
    return this.quizzesService.findOne(quizId);
  }

  // Get quizzes for a given course (shortcut)
  @Get('by-course/:courseId')
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.quizzesService.findByCourse(courseId);
  }

  // Update quiz (title, timeLimitSec, etc.)
  @Patch(':quizId')
  update(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return this.quizzesService.update(quizId, updateQuizDto);
  }

  // Publish quiz
  @Patch(':quizId/publish')
  publish(@Param('quizId', ParseIntPipe) quizId: number) {
    return this.quizzesService.publish(quizId);
  }

  // Unpublish quiz
  @Patch(':quizId/unpublish')
  unpublish(@Param('quizId', ParseIntPipe) quizId: number) {
    return this.quizzesService.unpublish(quizId);
  }

  // Delete quiz (respect business rules in service)
  @Delete(':quizId')
  remove(@Param('quizId', ParseIntPipe) quizId: number) {
    return this.quizzesService.remove(quizId);
  }
}
