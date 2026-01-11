import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { AdminCourseService } from 'src/services/Admin/admin-course.service';
import { UpdateCourseDto } from 'src/dtos/Course/update-course.dto';

@Controller('admin/courses')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminCourseController {
  constructor(private readonly courseService: AdminCourseService) {}

  @Get()
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  getCourseById(@Param('id') id: number) {
    return this.courseService.getCourseById(+id);
  }

  @Patch(':id')
  updateCourse(
    @Param('id') id: number,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(+id, dto);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: number) {
    return this.courseService.deleteCourse(+id);
  }
}
