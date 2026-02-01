import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateCourseReviewDto {
  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  course_id: number;
}
