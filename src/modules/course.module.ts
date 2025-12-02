import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseController } from "src/controllers/course.controller";
import { CourseTagMapping } from "src/entities/course-tags-mapping";
import { Tag } from "src/entities/course-tags.entity";
import { Course } from "src/entities/course.entity";
import { RolesGuard } from "src/guards/role.guard";
import { CourseService } from "src/services/course.service";
import { AuthModule } from "./auth.module";


@Module({
    imports: [TypeOrmModule.forFeature([Course, CourseTagMapping, Tag]),
        AuthModule],
    controllers: [CourseController],
    providers: [CourseService, RolesGuard]
})
export class CourseModule { }