import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LectureController } from "src/modules/lecture/lecture.controller";
import { Course } from "src/modules/course/entities/course.entity";
import { Lecture } from "src/modules/lecture/entities/lecture.entity";
import { User } from "src/modules/user/entity/user.entity";
import { LectureService } from "src/modules/lecture/lecture.service";
import { AuthModule } from "../auth/auth.module";
import { RolesGuard } from "src/common/guards/role.guard";
import { AuthGuard } from "src/common/guards/auth.guard";


@Module({
    imports: [TypeOrmModule.forFeature([Lecture, Course, User]),
AuthModule],
    controllers: [LectureController],
    providers:[LectureService, AuthGuard, RolesGuard],
})
export class LectureModule{}