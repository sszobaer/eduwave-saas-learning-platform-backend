import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from 'src/entities/quiz.entity';

@Injectable()
export class AdminQuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
  ) {}

  getAllQuizzes() {
    return this.quizRepo.find({
      relations: ['course', 'questions'],
    });
  }

  async deleteQuiz(id: number) {
    const quiz = await this.quizRepo.findOne({
      where: { quizId: id },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    await this.quizRepo.remove(quiz);
    return { message: 'Quiz deleted successfully' };
  }
}
