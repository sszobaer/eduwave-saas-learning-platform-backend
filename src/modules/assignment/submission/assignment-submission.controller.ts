// assignment-submission.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AssignmentSubmissionService } from 'src/modules/assignment/submission/assignment-submission.service';
import {
  CreateSubmissionDto,
  UpdateSubmissionDto,
} from 'src/modules/assignment/submission/dto/assignment-submission.dto';
import { User } from 'src/modules/user/entity/user.entity';

@Controller('submissions')
export class AssignmentSubmissionController {
  constructor(
    private readonly submissionService: AssignmentSubmissionService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() dto: CreateSubmissionDto,
    @Body('student') student: User,
  ) {
    return this.submissionService.create(dto, student);
  }

  @Get()
  async findAll() {
    return this.submissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.submissionService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubmissionDto,
  ) {
    return this.submissionService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.submissionService.remove(id);
  }
}
