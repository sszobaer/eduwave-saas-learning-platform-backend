import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LectureController } from "src/controllers/lecture.controller";
import { Course } from "src/entities/course.entity";
import { Lecture } from "src/entities/lecture.entity";
import { User } from "src/entities/user.entity";
import { LectureService } from "src/services/lecture.service";
import { AuthModule } from "./auth.module";
import { RolesGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";


@Module({
    imports: [TypeOrmModule.forFeature([Lecture, Course, User]),
AuthModule],
    controllers: [LectureController],
    providers:[LectureService, AuthGuard, RolesGuard],
})
export class LectureModule{}