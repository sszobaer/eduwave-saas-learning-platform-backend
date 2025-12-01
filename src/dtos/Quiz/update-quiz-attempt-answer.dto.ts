import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizAttemptAnswerDto } from './create-quiz-attempt-answer.dto';

export class UpdateQuizAttemptAnswerDto extends PartialType(
  CreateQuizAttemptAnswerDto,
) {}
