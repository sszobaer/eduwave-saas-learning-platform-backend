import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "src/controllers/auth.controller";
import { Role } from "src/entities/role.entity";
import { UserCredential } from "src/entities/user-credentital.entity";
import { AuthService } from "src/services/auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RefreshToken } from "src/entities/refresh-token.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/entities/user.entity";
import { PusherService } from "src/services/pusher.service";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User,UserCredential, Role, RefreshToken]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {expiresIn: config.get('JWT_EXPIRES')},
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, PusherService], 
  exports: [AuthService, AuthGuard, JwtModule, PusherService],  
})
export class AuthModule {}

