import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { AdminLectureService } from 'src/services/Admin/admin-lecture.service';

@Controller('admin/lectures')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminLectureController {
  constructor(private readonly lectureService: AdminLectureService) {}

  @Get()
  getAllLectures() {
    return this.lectureService.getAllLectures();
  }

  @Delete(':id')
  deleteLecture(@Param('id') id: number) {
    return this.lectureService.deleteLecture(+id);
  }
}
