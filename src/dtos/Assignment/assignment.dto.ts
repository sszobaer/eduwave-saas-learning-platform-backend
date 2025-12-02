import { IsNotEmpty, IsString, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateAssignmentDto {
  @IsInt()
  course_id: number;

  @IsInt()
  teacher_id: number;  // <-- SIMPLE ID ONLY

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  due_date: string;
}



export class UpdateAssignmentDto {
  @IsOptional()
  @IsInt()
  course_id?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  due_date?: string;
}