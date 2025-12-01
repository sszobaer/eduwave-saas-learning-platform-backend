import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, } from 'typeorm';
import { Question } from 'src/entities/question.entity';
import { QuizAttemptAnswer } from 'src/entities/quiz-attempt-answer.entity';

@Entity({ name: 'question_options' })
export class QuestionOption {
  @PrimaryGeneratedColumn({ name: 'option_id' })
  optionId: number;

  @ManyToOne(() => Question, (question) => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ name: 'question_id' })
  questionId: number;

  @Column({ name: 'option_text', type: 'text', nullable: true })
  optionText?: string;

  @Column({ name: 'option_image', type: 'text', nullable: true })
  optionImage?: string;

  @Column({ name: 'is_correct', type: 'boolean', default: false })
  isCorrect: boolean;

  @Column({ name: 'position', type: 'int' })
  position: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => QuizAttemptAnswer, (answer) => answer.option)
  attemptAnswers: QuizAttemptAnswer[];
}
