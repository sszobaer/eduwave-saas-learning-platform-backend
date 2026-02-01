import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AdminEnrollmentService } from 'src/modules/admin/enrollment/admin-enrollment.service';

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
