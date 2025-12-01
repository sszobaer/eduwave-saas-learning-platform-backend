import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Quiz } from './quiz.entity';
import { Payment } from './payment.entity';
import { Enrollment } from './enrollment.entity';
import { CourseTagMapping } from './course-tags-mapping';
import { Lecture } from './lecture.entity';
import { Assignment } from './assignment.entity';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn()
  course_id: number;

  @ManyToOne(() => User, (user) => user.created_courses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by_userId' })
  created_by_user: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  thumbnail_url: string;

  @OneToMany(() => Payment, (payment) => payment.course)
  payments: Payment[];

  @OneToMany(() => Quiz, (quiz) => quiz.course)
  quizzes: Quiz[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => CourseTagMapping, (mapping) => mapping.course)
  tagMappings: CourseTagMapping[];

  @OneToMany(() => Lecture, (lecture) => lecture.course)
  lectures: Lecture[];

  @OneToMany(() => Assignment, (assignment) => assignment.course)
  assignments: Assignment[];


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
