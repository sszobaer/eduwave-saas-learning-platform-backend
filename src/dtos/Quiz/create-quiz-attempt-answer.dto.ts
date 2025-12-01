import { IsInt } from 'class-validator';

export class CreateQuizAttemptAnswerDto {
  @IsInt()
  quizAttemptId: number;

  @IsInt()
  questionId: number;

  @IsInt()
  optionId: number;
}
