import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, } from 'typeorm';
import { QuizAttempt } from 'src/entities/quiz-attempt.entity';
import { Question } from 'src/entities/question.entity';
import { QuestionOption } from 'src/entities/question-option.entity';

@Entity({ name: 'quiz_attempt_answers' })
export class QuizAttemptAnswer {
  @PrimaryGeneratedColumn({ name: 'quiz_attempt_answer_id' })
  quizAttemptAnswerId: number;

  @ManyToOne(() => QuizAttempt, (attempt) => attempt.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_attempt_id' })
  quizAttempt: QuizAttempt;

  @Column({ name: 'quiz_attempt_id' })
  quizAttemptId: number;

  @ManyToOne(() => Question, (question) => question.attemptAnswers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ name: 'question_id' })
  questionId: number;

  @ManyToOne(() => QuestionOption, (option) => option.attemptAnswers, { eager: true })
  @JoinColumn({ name: 'option_id' })
  option: QuestionOption;

  @Column({ name: 'option_id' })
  optionId: number;

  @CreateDateColumn({ name: 'answered_at', type: 'timestamptz' })
  answeredAt: Date;
}
