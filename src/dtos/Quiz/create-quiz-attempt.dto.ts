import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { AttemptStatus } from 'src/entities/quiz-attempt.entity';

export class CreateQuizAttemptDto {
  @IsInt()
  quizId: number;

  @IsInt()
  studentUserId: number;

  // Usually you won't set this from API; system sets to startedAt = now()
  @IsOptional()
  @IsEnum(AttemptStatus)
  status?: AttemptStatus;
}
