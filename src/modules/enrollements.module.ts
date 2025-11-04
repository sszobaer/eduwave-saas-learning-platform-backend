import { Module } from '@nestjs/common';
import { EnrollmentController } from 'src/controllers/enrollment.controller';
import { EnrollmentService } from 'src/services/enrollment.service';

@Module({
    controllers : [EnrollementController],
    providers : [EnrollmentService]
})
export class EnrollementsModule {}
