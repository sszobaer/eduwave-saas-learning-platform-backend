import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { TeacherDashboardService } from 'src/modules/teacher/dashboard/teacher-dashboard.service';
import { GetUser } from "src/common/decorators/get-user.decorator";

@Controller('teacher')
@UseGuards(AuthGuard, RolesGuard)
@Roles('TEACHER')
export class TeacherDashboardController {
  constructor(
    private readonly teacherService: TeacherDashboardService
  ) {}

  @Get('dashboard')
  getDashboardStats(@GetUser() user: any) {
    return this.teacherService.getDashboardStats(user.sub);
  }
}
