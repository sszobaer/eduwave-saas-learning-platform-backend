import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AdminCourseService } from 'src/modules/admin/course/admin-course.service';
import { UpdateCourseDto } from 'src/modules/course/dto/update-course.dto';

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
