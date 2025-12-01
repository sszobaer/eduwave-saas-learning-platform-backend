import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from './user.entity';

@Entity('assignment_submission')
export class AssignmentSubmission {
  @PrimaryGeneratedColumn()
  assignment_submission_id: number;

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @ManyToOne(() => User, (user) => user.assignment_submissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_user_id' })
  student: User;

  @Column({ type: 'text' })
  submission_url: string;

  @Column({ type: 'int', nullable: true })
  marks: number;   

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ type: 'timestamp' })
  submitted_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
