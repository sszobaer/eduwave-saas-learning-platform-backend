import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { CourseTagMapping } from './course-tags-mapping';
import { Lecture } from '../../lecture/entities/lecture.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { CourseReview } from '../review/entities/course-review.entity';

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

  @OneToMany(() => Quiz, (quiz) => quiz.course, { onDelete: 'CASCADE' })
  quizzes: Quiz[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course, { onDelete: 'CASCADE' })
  enrollments: Enrollment[];

  @OneToMany(() => CourseTagMapping, (mapping) => mapping.course, { onDelete: 'CASCADE' })
  tagMappings: CourseTagMapping[];

  @OneToMany(() => Lecture, (lecture) => lecture.course, { onDelete: 'CASCADE' })
  lectures: Lecture[];

  @OneToMany(() => Assignment, (assignment) => assignment.course, { onDelete: 'CASCADE' })
  assignments: Assignment[];

  @OneToMany(() => CourseReview, (review) => review.course)
  reviews: CourseReview[];


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
