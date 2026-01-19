import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';
import { Payment } from './payment.entity';

@Entity('enrollment')
export class Enrollment {
  @PrimaryGeneratedColumn()
  enrollment_id: number;

  @ManyToOne(() => User, (user) => user.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_user_id' })
  student: User;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToOne(() => Payment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment | null;

 @CreateDateColumn({ type: 'timestamp' })
  enrolled_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
