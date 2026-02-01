import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AdminLectureService } from 'src/modules/admin/lecture/admin-lecture.service';

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
