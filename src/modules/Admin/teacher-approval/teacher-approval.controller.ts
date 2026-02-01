import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { TeacherApprovalService } from 'src/modules/admin/teacher-approval/teacher-approval.service';

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
