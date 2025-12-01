import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Quiz } from 'src/entities/quiz.entity';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn()
  course_id: number;

  @ManyToOne(() => User, (user) => user.created_courses, { onDelete: 'CASCADE' })
  created_by_user: User;

  @Column()
  created_by_user_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  thumbnail_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Quiz, (quiz) => quiz.course)
  quizzes: Quiz[];
}
