import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { AdminEnrollmentService } from 'src/services/Admin/admin-enrollment.service';

@Controller('admin/enrollments')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminEnrollmentController {
  constructor(private readonly enrollmentService: AdminEnrollmentService) {}

  @Get()
  getAllEnrollments() {
    return this.enrollmentService.getAllEnrollments();
  }
}
