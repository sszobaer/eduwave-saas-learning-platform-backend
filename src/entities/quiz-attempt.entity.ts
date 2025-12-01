import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, } from 'typeorm';
import { Quiz } from 'src/entities/quiz.entity';
import { User } from 'src/entities/user.entity';
import { QuizAttemptAnswer } from 'src/entities/quiz-attempt-answer.entity';

export enum AttemptStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  INPROGRESS = 'IN-PROGRESS'
}

@Entity({ name: 'quiz_attempts' })
export class QuizAttempt {
  @PrimaryGeneratedColumn({ name: 'quiz_attempt_id' })
  quizAttemptId: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.attempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @Column({ name: 'quiz_id' })
  quizId: number;

  @ManyToOne(() => User, (user) => user.quizAttempts, { eager: true })
  @JoinColumn({ name: 'student_user_id' })
  student: User;

  @Column({ name: 'student_user_id' })
  studentUserId: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: AttemptStatus,
    default: AttemptStatus.INPROGRESS
  })
  status: AttemptStatus;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ name: 'obtained_marks', type: 'int', nullable: true })
  obtainedMarks?: number;

  @Column({ name: 'max_marks', type: 'int', nullable: true })
  maxMarks?: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => QuizAttemptAnswer, (answer) => answer.quizAttempt)
  answers: QuizAttemptAnswer[];
}
