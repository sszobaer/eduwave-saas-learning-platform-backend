import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "src/controllers/auth.controller";
import { Role } from "src/entities/role.entity";
import { UserCredential } from "src/entities/user-credentital.entity";
import { AuthService } from "src/services/auth.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserCredential, Role]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '1d'}
        })
],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}