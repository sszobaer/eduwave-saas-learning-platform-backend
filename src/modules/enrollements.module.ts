import { Module } from '@nestjs/common';
import { EnrollmentController } from 'src/controllers/enrollment.controller';
import { EnrollmentService } from 'src/services/enrollment.service';

@Module({
    controllers : [EnrollementsModule],
    providers : [EnrollmentService]
})
export class EnrollementsModule {}
