import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { AdminDashboardService } from 'src/services/Admin/admin-dashboard.service';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDashboardController {
  constructor(
    private readonly adminService: AdminDashboardService,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getAdminDashboardData();
  }
}
