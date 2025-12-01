import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';
import { AssignmentSubmission } from './assignment-submissions.entity';

@Entity('assignment')
export class Assignment {
    @PrimaryGeneratedColumn()
    assignment_id: number;

    @ManyToOne(() => Course, (course) => course.assignments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => User, (user) => user.created_assignments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'created_by_user_id' })
    created_by_user: User;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'timestamp' })
    due_date: Date;

    @OneToMany(() => AssignmentSubmission, (submission) => submission.assignment)
    submissions: AssignmentSubmission[];

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
