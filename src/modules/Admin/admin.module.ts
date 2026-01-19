import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminDashboardController } from "src/controllers/Admin/admin-dashboard.controller";
import { Course } from "src/entities/course.entity";
import { User } from "src/entities/user.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { AdminDashboardService } from "src/services/Admin/admin-dashboard.service";
import { AuthModule } from "../auth.module";
import { AdminCourseController } from "src/controllers/Admin/admin-course.controller";
import { AdminEnrollmentController } from "src/controllers/Admin/admin-enrollment.controller";
import { AdminLectureController } from "src/controllers/Admin/admin-lecture.controller";
import { AdminQuizController } from "src/controllers/Admin/admin-quiz.controller";
import { Lecture } from "src/entities/lecture.entity";
import { Quiz } from "src/entities/quiz.entity";
import { AdminCourseService } from "src/services/Admin/admin-course.service";
import { AdminEnrollmentService } from "src/services/Admin/admin-enrollment.service";
import { AdminQuizService } from "src/services/Admin/admin-quiz.service";
import { Enrollment } from "src/entities/enrollment.entity";
import { AdminLectureService } from "src/services/Admin/admin-lecture.service";
import { TeacherApprovalController } from "src/controllers/Admin/teacher-approval.controller";
import { TeacherApprovalService } from "src/services/Admin/teacher-approval.service";
import { UserService } from "src/services/user.service";
import { AdminUserController } from "src/controllers/Admin/admin-user.controller";
import { CourseService } from "src/services/course.service";
import { CourseReview } from "src/entities/course-review.entity";
import { CourseTagMapping } from "src/entities/course-tags-mapping";
import { Payment } from "src/entities/payment.entity";
import { Tag } from "src/entities/course-tags.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Course, Lecture, Quiz, Enrollment, CourseReview, CourseTagMapping, Tag, Payment]), AuthModule],
    controllers: [AdminDashboardController, AdminCourseController, AdminEnrollmentController, AdminLectureController, AdminQuizController, AdminUserController, TeacherApprovalController],
    providers: [AdminDashboardService, AdminCourseService, AdminEnrollmentService, AdminQuizService, AdminLectureService, UserService, TeacherApprovalService, RolesGuard, CourseService, AuthGuard]
})

export class AdminDashboardModule { }