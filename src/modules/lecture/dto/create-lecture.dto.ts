import { BadRequestException } from '@nestjs/common';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateLectureDto {
    @IsNumber()
    course_id: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    lecture_video?: string;
}
