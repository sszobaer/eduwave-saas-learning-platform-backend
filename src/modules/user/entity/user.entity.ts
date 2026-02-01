import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { UserCredential } from "../../auth/entities/user-credentital.entity";
import { RefreshToken } from "../../auth/entities/refresh-token.entity";
import { Course } from "../../course/entities/course.entity";
import { Quiz } from "../../quiz/entities/quiz.entity";
import { QuizAttempt } from "../../quiz/attempt/entities/quiz-attempt.entity";
import { Enrollment } from "../../enrollment/entities/enrollment.entity";
import { Payment } from "../../payment/entities/payment.entity";
import { Lecture } from "../../lecture/entities/lecture.entity";
import { Assignment } from "../../assignment/entities/assignment.entity";
import { AssignmentSubmission } from "../../assignment/submission/entities/assignment-submissions.entity";
import { CourseReview } from "../../course/review/entities/course-review.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @ManyToOne(() => Role, (Role) => Role.users, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToOne(() => UserCredential, (credential) => credential.user)
    credential: UserCredential;

    @Column({ type: 'varchar', length: 30 })
    full_name: string;

    @Column({ type: 'text', nullable: true })
    profile_img: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => Course, (course) => course.created_by_user)
    created_courses: Course[];

    @OneToMany(() => Quiz, (quiz) => quiz.created_by_user)
    created_quizzes: Quiz[];

    @OneToMany(() => QuizAttempt, (attempt) => attempt.student)
    quizAttempts: QuizAttempt[];

    @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
    enrollments: Enrollment[];

    @OneToMany(() => Payment, (payment) => payment.student)
    payments: Payment[];

    @OneToMany(() => Lecture, (lecture) => lecture.created_by_user)
    created_lectures: Lecture[];

    @OneToMany(() => Assignment, (assignment) => assignment.created_by_user)
    created_assignments: Assignment[];

    @OneToMany(() => AssignmentSubmission, (submission) => submission.student)
    assignment_submissions: AssignmentSubmission[];

    @OneToMany(() => CourseReview, (review) => review.user)
    courseReviews: CourseReview[];


    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}