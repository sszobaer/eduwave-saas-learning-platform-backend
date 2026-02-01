import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminDashboardController } from "src/modules/admin/dashboard/admin-dashboard.controller";
import { Course } from "src/modules/course/entities/course.entity";
import { User } from "src/modules/user/entity/user.entity";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/role.guard";
import { AdminDashboardService } from "src/modules/admin/dashboard/admin-dashboard.service";
import { AuthModule } from "../auth/auth.module";
import { AdminCourseController } from "src/modules/admin/course/admin-course.controller";
import { AdminEnrollmentController } from "src/modules/admin/enrollment/admin-enrollment.controller";
import { AdminLectureController } from "src/modules/admin/lecture/admin-lecture.controller";
import { AdminQuizController } from "src/modules/admin/quiz/admin-quiz.controller";
import { Lecture } from "src/modules/lecture/entities/lecture.entity";
import { Quiz } from "src/modules/quiz/entities/quiz.entity";
import { AdminCourseService } from "src/modules/admin/course/admin-course.service";
import { AdminEnrollmentService } from "src/modules/admin/enrollment/admin-enrollment.service";
import { AdminQuizService } from "src/modules/admin/quiz/admin-quiz.service";
import { Enrollment } from "src/modules/enrollment/entities/enrollment.entity";
import { AdminLectureService } from "src/modules/admin/lecture/admin-lecture.service";
import { TeacherApprovalController } from "src/modules/admin/teacher-approval/teacher-approval.controller";
import { TeacherApprovalService } from "src/modules/admin/teacher-approval/teacher-approval.service";
import { UserService } from "src/modules/user/user.service";
import { AdminUserController } from "src/modules/admin/user/admin-user.controller";
import { CourseService } from "src/modules/course/course.service";
import { CourseReview } from "src/modules/course/review/entities/course-review.entity";
import { CourseTagMapping } from "src/modules/course/entities/course-tags-mapping";
import { Payment } from "src/modules/payment/entities/payment.entity";
import { Tag } from "src/modules/course/entities/course-tags.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Course, Lecture, Quiz, Enrollment, CourseReview, CourseTagMapping, Tag, Payment]), AuthModule],
    controllers: [AdminDashboardController, AdminCourseController, AdminEnrollmentController, AdminLectureController, AdminQuizController, AdminUserController, TeacherApprovalController],
    providers: [AdminDashboardService, AdminCourseService, AdminEnrollmentService, AdminQuizService, AdminLectureService, UserService, TeacherApprovalService, RolesGuard, CourseService, AuthGuard]
})

export class AdminDashboardModule { }