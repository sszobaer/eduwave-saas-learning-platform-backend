import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateQuestionOptionDto {
  @IsInt()
  questionId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  optionText?: string;

  @IsOptional()
  @IsString()
  optionImage?: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @IsInt()
  @Min(1)
  position: number;
}
