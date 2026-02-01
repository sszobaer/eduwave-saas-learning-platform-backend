import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseController } from "src/modules/course/course.controller";
import { CourseTagMapping } from "src/modules/course/entities/course-tags-mapping";
import { Tag } from "src/modules/course/entities/course-tags.entity";
import { Course } from "src/modules/course/entities/course.entity";
import { RolesGuard } from "src/common/guards/role.guard";
import { CourseService } from "src/modules/course/course.service";
import { AuthModule } from "../auth/auth.module";


@Module({
    imports: [TypeOrmModule.forFeature([Course, CourseTagMapping, Tag]),
        AuthModule],
    controllers: [CourseController],
    providers: [CourseService, RolesGuard]
})
export class CourseModule { }