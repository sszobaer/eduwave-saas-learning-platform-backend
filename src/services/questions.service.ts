import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/entities/question.entity';
import { Quiz } from 'src/entities/quiz.entity';
import { QuizAttempt } from 'src/entities/quiz-attempt.entity';
import { CreateQuestionDto } from 'src/dtos/Quiz/create-question.dto';
import { UpdateQuestionDto } from 'src/dtos/Quiz/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(QuizAttempt)
    private readonly attemptRepo: Repository<QuizAttempt>,
  ) {}

  private async ensureQuizModifiable(quizId: number) {
    const quiz = await this.quizRepo.findOne({ where: { quizId } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const attemptsCount = await this.attemptRepo.count({
      where: { quizId },
    });

    if (attemptsCount > 0) {
      throw new BadRequestException(
        'Cannot modify questions for a quiz that already has attempts',
      );
    }

    return quiz;
  }

  async create(dto: CreateQuestionDto): Promise<Question> {
    const quiz = await this.ensureQuizModifiable(dto.quizId);

    // Require at least text or image
    if (!dto.questionText && !dto.questionImage) {
      throw new BadRequestException(
        'Either questionText or questionImage must be provided',
      );
    }

    const question = this.questionRepo.create({
      quizId: quiz.quizId,
      // Optional properties: do NOT assign null
      questionText: dto.questionText,
      questionImage: dto.questionImage,
      marks: dto.marks,
    });

    return this.questionRepo.save(question);
  }

  async findByQuiz(quizId: number): Promise<Question[]> {
    return this.questionRepo.find({
      where: { quizId },
      relations: ['options'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(questionId: number): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { questionId },
      relations: ['quiz', 'options'],
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async update(
    questionId: number,
    dto: UpdateQuestionDto,
  ): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { questionId },
      relations: ['quiz'],
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const quizId = question.quizId;
    const attemptsCount = await this.attemptRepo.count({
      where: { quizId },
    });

    if (attemptsCount > 0) {
      if (dto.marks && dto.marks !== question.marks) {
        throw new BadRequestException(
          'Cannot change marks of a question after attempts exist',
        );
      }
      if (dto.quizId && dto.quizId !== quizId) {
        throw new BadRequestException('Cannot move question to another quiz');
      }
    } else {
      if (dto.quizId && dto.quizId !== quizId) {
        throw new BadRequestException('Cannot move question to another quiz');
      }
    }

    const finalText = dto.questionText ?? question.questionText;
    const finalImage = dto.questionImage ?? question.questionImage;
    if (!finalText && !finalImage) {
      throw new BadRequestException(
        'Either questionText or questionImage must be provided',
      );
    }

    question.questionText = dto.questionText ?? question.questionText;
    question.questionImage = dto.questionImage ?? question.questionImage;
    question.marks = dto.marks ?? question.marks;

    return this.questionRepo.save(question);
  }

  async remove(questionId: number): Promise<void> {
    const question = await this.questionRepo.findOne({
      where: { questionId },
      relations: ['quiz'],
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const quizId = question.quizId;
    const attemptsCount = await this.attemptRepo.count({
      where: { quizId },
    });
    if (attemptsCount > 0) {
      throw new BadRequestException(
        'Cannot delete question from a quiz that already has attempts',
      );
    }

    await this.questionRepo.remove(question);
  }
}

