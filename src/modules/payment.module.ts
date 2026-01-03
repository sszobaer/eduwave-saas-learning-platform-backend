import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentController } from "src/controllers/payment.controller";
import { Course } from "src/entities/course.entity";
import { Payment } from "src/entities/payment.entity";
import { User } from "src/entities/user.entity";
import { PaymentService } from "src/services/payment.service";

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Course, User])],
    controllers: [PaymentController],
    providers: [PaymentService]
})
export class PaymentModule{}