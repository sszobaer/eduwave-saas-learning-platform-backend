import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminDashboardController } from "src/controllers/Dashboard/admin-dashboard.controller";
import { Course } from "src/entities/course.entity";
import { User } from "src/entities/user.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";

import { AdminDashboardService } from "src/services/Dashboard/admin-dashboard.service";
import { AuthModule } from "../auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([User,Course]), AuthModule],
    controllers:[AdminDashboardController],
    providers: [AdminDashboardService, RolesGuard, AuthGuard]
})

export class AdminDashboardModule{}