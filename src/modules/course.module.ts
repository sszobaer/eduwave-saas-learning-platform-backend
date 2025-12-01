import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseTagMapping } from "src/entities/course-tags-mapping";
import { Tag } from "src/entities/course-tags.entity";
import { Course } from "src/entities/course.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Course, CourseTagMapping, Tag])]
})
export class CourseModule{ }