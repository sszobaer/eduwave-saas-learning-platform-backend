import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateCourseDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    price?: number;

    @IsOptional()
    @IsString()
    thumbnail_url?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tag_names?: string[];
}
