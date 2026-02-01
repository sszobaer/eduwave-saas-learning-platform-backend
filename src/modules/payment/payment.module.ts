import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentController } from "src/modules/payment/payment.controller";
import { Course } from "src/modules/course/entities/course.entity";
import { Payment } from "src/modules/payment/entities/payment.entity";
import { User } from "src/modules/user/entity/user.entity";
import { PaymentService } from "src/modules/payment/payment.service";

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Course, User])],
    controllers: [PaymentController],
    providers: [PaymentService]
})
export class PaymentModule{}