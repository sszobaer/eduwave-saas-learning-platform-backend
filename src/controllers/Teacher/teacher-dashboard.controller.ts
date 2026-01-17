import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { TeacherDashboardService } from 'src/services/Teacher/teacher-dashboard.service';
import { GetUser } from "src/decorators/get-user.decorator";

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
