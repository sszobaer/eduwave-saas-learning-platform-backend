import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { TeacherApprovalService } from 'src/services/Admin/teacher-approval.service';

@Controller('admin/teachers')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class TeacherApprovalController {
  constructor(
    private readonly teacherApprovalService: TeacherApprovalService,
  ) {}

  @Get('pending')
  getPendingTeachers() {
    return this.teacherApprovalService.getPendingTeachers();
  }

  @Patch('approve/:id')
  approveTeacher(@Param('id') id: number) {
    return this.teacherApprovalService.approveTeacher(+id);
  }

  @Delete('reject/:id')
  rejectTeacher(@Param('id') id: number) {
    return this.teacherApprovalService.rejectTeacher(+id);
  }
}
