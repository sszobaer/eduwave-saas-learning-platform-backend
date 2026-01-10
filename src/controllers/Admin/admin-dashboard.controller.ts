import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { AdminDashboardService } from 'src/services/Admin/admin-dashboard.service';


@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
export class AdminDashboardController {
  constructor(
    private readonly adminService: AdminDashboardService
  ) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/block')
  blockUser(@Param('id') id: number) {
    return this.adminService.blockUser(+id);
  }

  @Patch('users/:id/unblock')
  unblockUser(@Param('id') id: number) {
    return this.adminService.unblockUser(+id);
  }
}
