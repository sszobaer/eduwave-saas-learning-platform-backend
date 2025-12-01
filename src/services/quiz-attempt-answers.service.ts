import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizAttemptAnswer } from 'src/entities/quiz-attempt-answer.entity';
import { CreateQuizAttemptAnswerDto } from 'src/dtos/Quiz/create-quiz-attempt-answer.dto';
import { UpdateQuizAttemptAnswerDto } from 'src/dtos/Quiz/update-quiz-attempt-answer.dto';
import {
  AttemptStatus,
  QuizAttempt,
} from 'src/entities/quiz-attempt.entity';
import { Question } from 'src/entities/question.entity';
import { QuestionOption } from 'src/entities/question-option.entity';
import { QuizAttemptsService } from 'src/services/quiz-attempts.service';

@Injectable()
export class QuizAttemptAnswersService {
  constructor(
    @InjectRepository(QuizAttemptAnswer)
    private readonly answerRepo: Repository<QuizAttemptAnswer>,
    @InjectRepository(QuizAttempt)
    private readonly attemptRepo: Repository<QuizAttempt>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(QuestionOption)
    private readonly optionRepo: Repository<QuestionOption>,
    private readonly quizAttemptsService: QuizAttemptsService,
  ) {}

  private async validateAttemptAndTime(
    attemptId: number,
  ): Promise<QuizAttempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { quizAttemptId: attemptId },
      relations: ['quiz'],
    });
    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    if (attempt.status === AttemptStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot submit answers to a completed attempt',
      );
    }
    if (attempt.status === AttemptStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot submit answers to a cancelled attempt',
      );
    }

    // Enforce time limit and auto-complete on expiry
    if (
      attempt.quiz.timeLimitSec &&
      attempt.startedAt &&
      new Date().getTime() >
        attempt.startedAt.getTime() +
          attempt.quiz.timeLimitSec * 1000
    ) {
      // Auto-complete & grade with whatever answers exist
      await this.quizAttemptsService.completeAttempt(attempt.quizAttemptId);

      throw new BadRequestException(
        'Time limit exceeded. Attempt has been auto-submitted.',
      );
    }

    return attempt;
  }

  private async validateQuestionAndOption(
    attempt: QuizAttempt,
    questionId: number,
    optionId: number,
  ): Promise<{ question: Question; option: QuestionOption }> {
    const question = await this.questionRepo.findOne({
      where: { questionId },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    if (question.quizId !== attempt.quizId) {
      throw new BadRequestException(
        'Question does not belong to this quiz',
      );
    }

    const option = await this.optionRepo.findOne({
      where: { optionId },
    });
    if (!option) {
      throw new NotFoundException('Option not found');
    }
    if (option.questionId !== question.questionId) {
      throw new BadRequestException(
        'Option does not belong to this question',
      );
    }

    return { question, option };
  }

  async submitOrUpdateAnswer(
    dto: CreateQuizAttemptAnswerDto,
  ): Promise<QuizAttemptAnswer> {
    const attempt = await this.validateAttemptAndTime(
      dto.quizAttemptId,
    );

    const { question, option } = await this.validateQuestionAndOption(
      attempt,
      dto.questionId,
      dto.optionId,
    );

    let answer = await this.answerRepo.findOne({
      where: {
        quizAttemptId: attempt.quizAttemptId,
        questionId: question.questionId,
      },
    });

    if (answer) {
      answer.optionId = option.optionId;
    } else {
      answer = this.answerRepo.create({
        quizAttemptId: attempt.quizAttemptId,
        questionId: question.questionId,
        optionId: option.optionId,
      });
    }

    return this.answerRepo.save(answer);
  }

  async submitBulkAnswers(
    dtos: CreateQuizAttemptAnswerDto[],
  ): Promise<QuizAttemptAnswer[]> {
    if (dtos.length === 0) {
      throw new BadRequestException('No answers provided');
    }

    const attemptId = dtos[0].quizAttemptId;
    if (!dtos.every((d) => d.quizAttemptId === attemptId)) {
      throw new BadRequestException(
        'All answers must belong to the same attempt',
      );
    }

    const attempt = await this.validateAttemptAndTime(attemptId);
    const results: QuizAttemptAnswer[] = [];

    for (const dto of dtos) {
      const { question, option } = await this.validateQuestionAndOption(
        attempt,
        dto.questionId,
        dto.optionId,
      );

      let answer = await this.answerRepo.findOne({
        where: {
          quizAttemptId: attempt.quizAttemptId,
          questionId: question.questionId,
        },
      });

      if (answer) {
        answer.optionId = option.optionId;
      } else {
        answer = this.answerRepo.create({
          quizAttemptId: attempt.quizAttemptId,
          questionId: question.questionId,
          optionId: option.optionId,
        });
      }

      const saved = await this.answerRepo.save(answer);
      results.push(saved);
    }

    return results;
  }

  async findByAttempt(
    attemptId: number,
  ): Promise<QuizAttemptAnswer[]> {
    const attempt = await this.attemptRepo.findOne({
      where: { quizAttemptId: attemptId },
    });
    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    return this.answerRepo.find({
      where: { quizAttemptId: attemptId },
      relations: ['question', 'option'],
      order: { quizAttemptAnswerId: 'ASC' },
    });
  }

  async findOne(answerId: number): Promise<QuizAttemptAnswer> {
    const answer = await this.answerRepo.findOne({
      where: { quizAttemptAnswerId: answerId },
      relations: ['quizAttempt', 'question', 'option'],
    });
    if (!answer) {
      throw new NotFoundException('Quiz attempt answer not found');
    }
    return answer;
  }

  async update(
    answerId: number,
    dto: UpdateQuizAttemptAnswerDto,
  ): Promise<QuizAttemptAnswer> {
    const answer = await this.answerRepo.findOne({
      where: { quizAttemptAnswerId: answerId },
    });
    if (!answer) {
      throw new NotFoundException('Quiz attempt answer not found');
    }

    const attempt = await this.validateAttemptAndTime(
      answer.quizAttemptId,
    );

    if (
      dto.quizAttemptId &&
      dto.quizAttemptId !== answer.quizAttemptId
    ) {
      throw new BadRequestException(
        'Cannot move answer to another attempt',
      );
    }

    const questionId = dto.questionId ?? answer.questionId;
    const optionId = dto.optionId ?? answer.optionId;

    await this.validateQuestionAndOption(
      attempt,
      questionId,
      optionId,
    );

    answer.questionId = questionId;
    answer.optionId = optionId;

    return this.answerRepo.save(answer);
  }
}
