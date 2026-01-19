   // src/enrollment/dto/enrollment.dto.ts
   import {
   IsInt,
   IsOptional,
   IsPositive,
   IsDateString,
   } from 'class-validator';
   import { Type } from 'class-transformer';

   export class CreateEnrollmentDto {
   @IsInt()
   @IsPositive()
   @Type(() => Number)
   student_user_id: number;

   @IsInt()
   @IsPositive()
   @Type(() => Number)
   course_id: number;

   @IsOptional()
   @IsInt()
   @IsPositive()
   @Type(() => Number)
   payment_id?: number;
   }

   export class UpdateEnrollmentDto {
   @IsOptional()
   @IsInt()
   @IsPositive()
   @Type(() => Number)
   student_user_id?: number;

   @IsOptional()
   @IsInt()
   @IsPositive()
   @Type(() => Number)
   course_id?: number;

   @IsOptional()
   @IsInt()
   @IsPositive()
   @Type(() => Number)
   payment_id?: number;

   @IsOptional()
   @IsDateString()
   enrolled_at?: string;
   }

   export class SearchEnrollmentDto {
   @IsOptional()
   @IsInt()
   @Type(() => Number)
   student_user_id?: number;

   @IsOptional()
   @IsInt()
   @Type(() => Number)
   course_id?: number;

   @IsOptional()
   @IsInt()
   @Type(() => Number)
   payment_id?: number;

   // date range filtering (ISO date strings)
   @IsOptional()
   @IsDateString()
   start_date?: string;

   @IsOptional()
   @IsDateString()
   end_date?: string;
}
