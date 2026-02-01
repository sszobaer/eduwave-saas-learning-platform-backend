import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateQuestionDto {
  @IsInt()
  quizId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  questionText?: string;

  @IsOptional()
  @IsString()
  questionImage?: string;

  @IsInt()
  @Min(1)
  marks: number;
}
