import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Lecture } from "src/entities/lecture.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Lecture])]
})
export class LectureModule{}