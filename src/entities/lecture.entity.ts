import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';

@Entity('lecture')
export class Lecture {
  @PrimaryGeneratedColumn()
  lecture_id: number;

  // FK → courses(course_id)
  @ManyToOne(() => Course, (course) => course.lectures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  // FK → users(user_id)
  @ManyToOne(() => User, (user) => user.created_lectures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by_user_id' })
  created_by_user: User;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'timestamp' })
  scheduled_at: Date;

  @Column({ type: 'text' })
  jitsi_link: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
