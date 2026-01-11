import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  AttemptStatus,
  QuizAttempt,
} from 'src/entities/quiz-attempt.entity';
import { Quiz } from 'src/entities/quiz.entity';
import { Question } from 'src/entities/question.entity';
import { QuizAttemptAnswer } from 'src/entities/quiz-attempt-answer.entity';
import { QuestionOption } from 'src/entities/question-option.entity';
import { User } from 'src/entities/user.entity';
import { CreateQuizAttemptDto } from 'src/dtos/Quiz/create-quiz-attempt.dto';
import { UpdateQuizAttemptDto } from 'src/dtos/Quiz/update-quiz-attempt.dto';
import { EmailService } from 'src/services/email.service';
import { UserCredential } from 'src/entities/user-credentital.entity';


interface FindByStudentFilter {
  studentUserId: number;
  quizId?: number;
}

@Injectable()
export class QuizAttemptsService {
  constructor(
    @InjectRepository(QuizAttempt)
    private readonly attemptRepo: Repository<QuizAttempt>,
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(QuizAttemptAnswer)
    private readonly answerRepo: Repository<QuizAttemptAnswer>,
    @InjectRepository(QuestionOption)
    private readonly optionRepo: Repository<QuestionOption>,
    @InjectRepository(UserCredential)
    private readonly credentialRepo: Repository<UserCredential>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly emailService: EmailService
  ) {}

  private async computeMaxMarks(quizId: number): Promise<number> {
    const questions = await this.questionRepo.find({
      where: { quizId },
    });
    return questions.reduce((sum, q) => sum + q.marks, 0);
  }

  async startAttempt(dto: CreateQuizAttemptDto): Promise<QuizAttempt> {
    const quiz = await this.quizRepo.findOne({
      where: { quizId: dto.quizId },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    if (!quiz.isPublished) {
      throw new BadRequestException('Quiz is not published');
    }

    const student = await this.userRepo.findOne({
      where: { user_id: dto.studentUserId },
      relations: ['role'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Only one active attempt (status null) per quiz per student
    const existing = await this.attemptRepo.findOne({
      where: {
        quizId: dto.quizId,
        studentUserId: dto.studentUserId,
      },
    });
    if (existing) {
      throw new BadRequestException(
        'There is already an active attempt for this quiz',
      );
    }

    const maxMarks = await this.computeMaxMarks(quiz.quizId);

    const attempt = this.attemptRepo.create({
      quizId: quiz.quizId,
      studentUserId: student.user_id,
      status: AttemptStatus.INPROGRESS,
      startedAt: new Date(),
      // completedAt, obtainedMarks left undefined initially
      maxMarks,
    });

    return this.attemptRepo.save(attempt);
  }

  async findByQuiz(quizId: number): Promise<QuizAttempt[]> {
    return this.attemptRepo.find({
      where: { quizId },
      relations: ['student'],
      order: { startedAt: 'DESC' },
    });
  }

  async findByStudent(
    filter: FindByStudentFilter,
  ): Promise<QuizAttempt[]> {
    const where: FindOptionsWhere<QuizAttempt> = {
      studentUserId: filter.studentUserId,
    };
    if (filter.quizId !== undefined) {
      where.quizId = filter.quizId;
    }

    return this.attemptRepo.find({
      where,
      relations: ['quiz'],
      order: { startedAt: 'DESC' },
    });
  }

  async findOne(attemptId: number): Promise<QuizAttempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { quizAttemptId: attemptId },
      relations: [
        'quiz',
        'student',
        'answers',
        'answers.question',
        'answers.option',
      ],
    });
    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }
    return attempt;
  }

  async update(
    attemptId: number,
    dto: UpdateQuizAttemptDto,
  ): Promise<QuizAttempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { quizAttemptId: attemptId },
    });
    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    if (dto.quizId && dto.quizId !== attempt.quizId) {
      throw new BadRequestException('Cannot change quiz of attempt');
    }
    if (
      dto.studentUserId &&
      dto.studentUserId !== attempt.studentUserId
    ) {
      throw new BadRequestException('Cannot change owner of attempt');
    }

    Object.assign(attempt, dto);

    return this.attemptRepo.save(attempt);
  }

  private async gradeAttempt(attempt: QuizAttempt): Promise<{
    obtainedMarks: number;
    maxMarks: number;
  }> {
    const fullAttempt = await this.attemptRepo.findOne({
      where: { quizAttemptId: attempt.quizAttemptId },
      relations: [
        'quiz',
        'answers',
        'answers.question',
        'answers.option',
      ],
    });

    if (!fullAttempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    const quizId = fullAttempt.quizId;

    const questions = await this.questionRepo.find({
      where: { quizId },
      relations: ['options'],
    });

    const answers = fullAttempt.answers || [];

    const answersByQuestionId = new Map<number, QuizAttemptAnswer[]>();
    for (const ans of answers) {
      const arr = answersByQuestionId.get(ans.questionId) || [];
      arr.push(ans);
      answersByQuestionId.set(ans.questionId, arr);
    }

    let obtainedMarks = 0;
    let maxMarks = 0;

    for (const question of questions) {
      maxMarks += question.marks;

      const correctOptions = question.options.filter(
        (o) => o.isCorrect,
      );
      const correctIds = correctOptions.map((o) => o.optionId);

      const selectedAnswers =
        answersByQuestionId.get(question.questionId) || [];
      const selectedOptionIds = selectedAnswers.map(
        (a) => a.optionId,
      );

      // Single-correct rule:
      // - exactly one correct option configured
      // - student selected exactly one option
      // - and that option is the correct one
      const isSingleCorrectConfigured = correctIds.length === 1;
      const isSingleSelected = selectedOptionIds.length === 1;

      const isCorrect =
        isSingleCorrectConfigured &&
        isSingleSelected &&
        selectedOptionIds[0] === correctIds[0];

      if (isCorrect) {
        obtainedMarks += question.marks;
      }
    }

    return { obtainedMarks, maxMarks };
  }

  async completeAttempt(attemptId: number): Promise<QuizAttempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { quizAttemptId: attemptId },
      relations: ['quiz'],
    });
    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    if (attempt.status === AttemptStatus.COMPLETED) {
      throw new BadRequestException('Attempt already completed');
    }
    if (attempt.status === AttemptStatus.CANCELLED) {
      throw new BadRequestException('Attempt has been cancelled');
    }

    // Always grade with whatever answers exist (auto-submit uses this too)
    const { obtainedMarks, maxMarks } = await this.gradeAttempt(
      attempt,
    );

    attempt.obtainedMarks = obtainedMarks;
    attempt.maxMarks = maxMarks;
    attempt.status = AttemptStatus.COMPLETED;
    attempt.completedAt = new Date();

    //return this.attemptRepo.save(attempt);
    const saved = await this.attemptRepo.save(attempt);

    const name = await this.userRepo.findOne({
      select:{full_name:true},
      where: { user_id: saved.studentUserId },
    });

    // const auth = await this.authRepo.findOne({
    //   where: { user: { user_id: saved.studentUserId}},
    // });

    const credential = await this.credentialRepo.findOne({
      where: {
        user:{
          user_id: saved.studentUserId,
        }
      }
    });

if (!credential) throw new Error("Credential not found");

console.log("Email:", credential.email);


  
   if (name?.full_name && credential?.email ) {
    const percent = maxMarks > 0 ? ((obtainedMarks / maxMarks) * 100).toFixed(2) : '0';
    console.log("name result:", name.full_name);
    console.log("Email result:", credential.email);
    await this.emailService.sendEmail({
    to: credential.email,
    subject: `Quiz Result: ${saved.quiz.title}`,
    template: 'quiz-result',
    context: {
      studentName: name.full_name,
      quizTitle: saved.quiz.title,
      obtainedMarks,
      maxMarks,
      percentage: percent,
    },
  });
}

  return saved;
}

  async cancelAttempt(attemptId: number): Promise<QuizAttempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { quizAttemptId: attemptId },
    });
    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    if (attempt.status === AttemptStatus.COMPLETED) {
      throw new BadRequestException('Attempt already completed');
    }
    if (attempt.status === AttemptStatus.CANCELLED) {
      return attempt;
    }

    attempt.status = AttemptStatus.CANCELLED;
    attempt.completedAt = new Date();
    attempt.obtainedMarks = 0;

    return this.attemptRepo.save(attempt);
  }
}

