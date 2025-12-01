import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Quiz } from 'src/entities/quiz.entity';
import { Course } from 'src/entities/course.entity';
import { QuizAttempt } from 'src/entities/quiz-attempt.entity';
import { Question } from 'src/entities/question.entity';
import { CreateQuizDto } from 'src/dtos/Quiz/create-quiz.dto';
import { UpdateQuizDto } from 'src/dtos/Quiz/update-quiz.dto';

interface FindAllQuizzesFilter {
  courseId?: number;
  isPublished?: boolean;
}

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(QuizAttempt)
    private readonly attemptRepo: Repository<QuizAttempt>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async create(dto: CreateQuizDto): Promise<Quiz> {
    // Course entity uses course_id
    const course = await this.courseRepo.findOne({
      where: { course_id: dto.courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const quiz = this.quizRepo.create({
      courseId: dto.courseId,
      createdByUserId: dto.createdByUserId,
      title: dto.title,
      // timeLimitSec is optional (number | undefined), do NOT set null
      timeLimitSec: dto.timeLimitSec,
      isPublished: dto.isPublished ?? false,
    });

    return this.quizRepo.save(quiz);
  }

  async findAll(filter: FindAllQuizzesFilter): Promise<Quiz[]> {
    const where: FindOptionsWhere<Quiz> = {};

    if (filter.courseId !== undefined) {
      where.courseId = filter.courseId;
    }

    if (filter.isPublished !== undefined) {
      where.isPublished = filter.isPublished;
    }

    return this.quizRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findByCourse(courseId: number): Promise<Quiz[]> {
    return this.quizRepo.find({
      where: { courseId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(quizId: number): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({
      where: { quizId },
      relations: ['course'],
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  async update(quizId: number, dto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({ where: { quizId } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (dto.courseId && dto.courseId !== quiz.courseId) {
      throw new BadRequestException('Cannot change quiz course');
    }
    if (dto.createdByUserId && dto.createdByUserId !== quiz.createdByUserId) {
      throw new BadRequestException('Cannot change quiz owner');
    }

    // isPublished must go through publish/unpublish
    if (dto.isPublished !== undefined && dto.isPublished !== quiz.isPublished) {
      throw new BadRequestException(
        'Use publish/unpublish endpoints to change publish status',
      );
    }

    quiz.title = dto.title ?? quiz.title;

    if (dto.timeLimitSec !== undefined) {
      quiz.timeLimitSec = dto.timeLimitSec;
    }

    return this.quizRepo.save(quiz);
  }

  async publish(quizId: number): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({ where: { quizId } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.isPublished) return quiz;

    // Must have at least one question
    const questions = await this.questionRepo.find({
      where: { quizId },
      relations: ['options'],
    });
    if (questions.length === 0) {
      throw new BadRequestException(
        'Cannot publish quiz without any questions',
      );
    }

    // Single-correct validation: each question must have exactly one correct option
    for (const q of questions) {
      if (!q.options || q.options.length === 0) {
        throw new BadRequestException(
          `Question ${q.questionId} has no options`,
        );
      }

      const correctOptions = q.options.filter((o) => o.isCorrect);
      if (correctOptions.length === 0) {
        throw new BadRequestException(
          `Question ${q.questionId} must have exactly one correct option, found 0`,
        );
      }
      if (correctOptions.length > 1) {
        throw new BadRequestException(
          `Question ${q.questionId} must have exactly one correct option, found ${correctOptions.length}`,
        );
      }
    }

    quiz.isPublished = true;
    return this.quizRepo.save(quiz);
  }

  async unpublish(quizId: number): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({ where: { quizId } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (!quiz.isPublished) return quiz;

    const attemptsCount = await this.attemptRepo.count({
      where: { quizId },
    });
    if (attemptsCount > 0) {
      throw new BadRequestException(
        'Cannot unpublish quiz with existing attempts',
      );
    }

    quiz.isPublished = false;
    return this.quizRepo.save(quiz);
  }

  async remove(quizId: number): Promise<void> {
    const quiz = await this.quizRepo.findOne({ where: { quizId } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const attemptsCount = await this.attemptRepo.count({
      where: { quizId },
    });
    if (attemptsCount > 0) {
      throw new BadRequestException(
        'Cannot delete quiz that has attempts. Consider soft delete instead.',
      );
    }

    await this.quizRepo.remove(quiz);
  }
}

