// src/enrollment/enrollment.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnrollmentService } from 'src/services/enrollment.service';
import {
  CreateEnrollmentDto,
  UpdateEnrollmentDto,
  SearchEnrollmentDto,
} from 'src/dtos/Enrollment/enrollment.dto';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('create')
  async create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentService.create(dto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: SearchEnrollmentDto) {
    return this.enrollmentService.findAll(query);
  }

  // ✅ NEW ENDPOINT: Get student's enrolled courses
  @Get('student/:studentId')
  async getStudentEnrollments(
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.enrollmentService.getStudentEnrollments(studentId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentService.update(id, dto);
  }

  /**
   * Partial update (PATCH)
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentService.patch(id, dto);
  }

  /**
   * Delete enrollment
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.enrollmentService.remove(id);
  }
}
