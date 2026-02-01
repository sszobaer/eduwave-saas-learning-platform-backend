import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AdminDashboardService } from 'src/modules/admin/dashboard/admin-dashboard.service';

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
