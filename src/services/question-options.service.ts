import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { QuestionOption } from 'src/entities/question-option.entity';
import { Question } from 'src/entities/question.entity';
import { Quiz } from 'src/entities/quiz.entity';
import { QuizAttempt } from 'src/entities/quiz-attempt.entity';
import { CreateQuestionOptionDto } from 'src/dtos/Quiz/create-question-option.dto';
import { UpdateQuestionOptionDto } from 'src/dtos/Quiz/update-question-option.dto';

@Injectable()
export class QuestionOptionsService {
  constructor(
    @InjectRepository(QuestionOption)
    private readonly optionRepo: Repository<QuestionOption>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(QuizAttempt)
    private readonly attemptRepo: Repository<QuizAttempt>,
  ) {}

  private async checkQuizAttemptsForQuestion(questionId: number) {
    const question = await this.questionRepo.findOne({
      where: { questionId },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const quizId = question.quizId;
    const attemptsCount = await this.attemptRepo.count({
      where: { quizId },
    });

    return { question, quizHasAttempts: attemptsCount > 0 };
  }

  async create(dto: CreateQuestionOptionDto): Promise<QuestionOption> {
    const { question, quizHasAttempts } =
      await this.checkQuizAttemptsForQuestion(dto.questionId);

    if (quizHasAttempts) {
      throw new BadRequestException(
        'Cannot add options to a question whose quiz already has attempts',
      );
    }

    if (!dto.optionText && !dto.optionImage) {
      throw new BadRequestException(
        'Either optionText or optionImage must be provided',
      );
    }

    // Single-correct enforcement: at most ONE correct option per question
    if (dto.isCorrect) {
      const existingCorrect = await this.optionRepo.count({
        where: { questionId: question.questionId, isCorrect: true },
      });
      if (existingCorrect > 0) {
        throw new BadRequestException(
          'This question already has a correct option. Only one correct option is allowed.',
        );
      }
    }

    const option = this.optionRepo.create({
      questionId: question.questionId,
      // Optional properties: do NOT assign null
      optionText: dto.optionText,
      optionImage: dto.optionImage,
      isCorrect: dto.isCorrect ?? false,
      position: dto.position,
    });

    return this.optionRepo.save(option);
  }

  async findByQuestion(questionId: number): Promise<QuestionOption[]> {
    const question = await this.questionRepo.findOne({
      where: { questionId },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return this.optionRepo.find({
      where: { questionId },
      order: { position: 'ASC' },
    });
  }

  async findOne(optionId: number): Promise<QuestionOption> {
    const option = await this.optionRepo.findOne({
      where: { optionId },
      relations: ['question'],
    });
    if (!option) {
      throw new NotFoundException('Question option not found');
    }
    return option;
  }

  async update(
    optionId: number,
    dto: UpdateQuestionOptionDto,
  ): Promise<QuestionOption> {
    const option = await this.optionRepo.findOne({
      where: { optionId },
      relations: ['question'],
    });
    if (!option) {
      throw new NotFoundException('Question option not found');
    }

    const quizId = option.question.quizId;
    const attemptsCount = await this.attemptRepo.count({
      where: { quizId },
    });
    const quizHasAttempts = attemptsCount > 0;

    if (dto.questionId && dto.questionId !== option.questionId) {
      throw new BadRequestException('Cannot move option to another question');
    }

    if (quizHasAttempts) {
      // After attempts exist, restrict to text/image only
      if (
        dto.isCorrect !== undefined &&
        dto.isCorrect !== option.isCorrect
      ) {
        throw new BadRequestException(
          'Cannot change isCorrect after attempts exist',
        );
      }
      if (dto.position !== undefined && dto.position !== option.position) {
        throw new BadRequestException(
          'Cannot change option position after attempts exist',
        );
      }
    } else {
      // Single-correct enforcement BEFORE attempts exist
      if (dto.isCorrect === true && option.isCorrect === false) {
        const existingCorrect = await this.optionRepo.count({
          where: {
            questionId: option.questionId,
            isCorrect: true,
            optionId: Not(option.optionId),
          },
        });
        if (existingCorrect > 0) {
          throw new BadRequestException(
            'This question already has a correct option. Only one correct option is allowed.',
          );
        }
      }
    }

    const finalText = dto.optionText ?? option.optionText;
    const finalImage = dto.optionImage ?? option.optionImage;
    if (!finalText && !finalImage) {
      throw new BadRequestException(
        'Either optionText or optionImage must be provided',
      );
    }

    option.optionText = dto.optionText ?? option.optionText;
    option.optionImage = dto.optionImage ?? option.optionImage;
    option.isCorrect =
      dto.isCorrect !== undefined ? dto.isCorrect : option.isCorrect;
    option.position = dto.position ?? option.position;

    return this.optionRepo.save(option);
  }

  async remove(optionId: number): Promise<void> {
    const option = await this.optionRepo.findOne({
      where: { optionId },
      relations: ['question'],
    });
    if (!option) {
      throw new NotFoundException('Question option not found');
    }

    const quizId = option.question.quizId;
    const attemptsCount = await this.attemptRepo.count({
      where: { quizId },
    });
    if (attemptsCount > 0) {
      throw new BadRequestException(
        'Cannot delete options from a quiz that already has attempts',
      );
    }

    await this.optionRepo.remove(option);
  }
}

