import { IsInt, IsNotEmpty, IsString, IsUrl, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateSubmissionDto {
  @IsInt()
  assignment_id: number;

  @IsUrl()
  @IsNotEmpty()
  submission_url: string;

  @IsDateString()
  submitted_at: string;
}

export class UpdateSubmissionDto {
  @IsOptional()
  @IsUrl()
  submission_url?: string;

  @IsOptional()
  @IsDateString()
  submitted_at?: string;

  @IsOptional()
  @IsNumber()
  marks?: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}
