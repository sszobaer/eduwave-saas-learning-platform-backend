import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "src/modules/auth/auth.controller";
import { Role } from "src/modules/role/entities/role.entity";
import { UserCredential } from "src/modules/auth/entities/user-credentital.entity";
import { AuthService } from "src/modules/auth/auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RefreshToken } from "src/modules/auth/entities/refresh-token.entity";
import { AuthGuard } from "src/common/guards/auth.guard";
import { User } from "src/modules/user/entity/user.entity";
import { PusherService } from "src/modules/auth/helper/pusher.service";

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

