import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "src/controllers/auth.controller";
import { Role } from "src/entities/role.entity";
import { UserCredential } from "src/entities/user-credentital.entity";
import { AuthService } from "src/services/auth.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserCredential, Role])],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}