import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignmentSubmission } from "src/entities/assignment-submissions.entity";
import { Assignment } from "src/entities/assignment.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Assignment, AssignmentSubmission,])]
})
export class AssignmentModule {}