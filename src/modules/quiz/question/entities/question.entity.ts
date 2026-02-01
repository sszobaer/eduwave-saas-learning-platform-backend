import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, } from 'typeorm';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { QuestionOption } from 'src/modules/quiz/question/option/entities/question-option.entity';
import { QuizAttemptAnswer } from 'src/modules/quiz/attempt/answer/entities/quiz-attempt-answer.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn({ name: 'question_id' })
  questionId: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @Column({ name: 'quiz_id' })
  quizId: number;

  @Column({ name: 'question_text', type: 'text', nullable: true })
  questionText?: string;

  @Column({ name: 'question_image', type: 'text', nullable: true })
  questionImage?: string;

  @Column({ name: 'marks', type: 'int' })
  marks: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => QuestionOption, (option) => option.question)
  options: QuestionOption[];

  @OneToMany(() => QuizAttemptAnswer, (answer) => answer.question)
  attemptAnswers: QuizAttemptAnswer[];
}
