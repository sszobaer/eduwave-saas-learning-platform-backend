import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "src/controllers/auth.controller";
import { Role } from "src/entities/role.entity";
import { UserCredential } from "src/entities/user-credentital.entity";
import { AuthService } from "src/services/auth.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserCredential, Role]),
        PassportModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}