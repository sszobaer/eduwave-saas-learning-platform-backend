import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';
import { AuthModule } from './auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthModule, 
    ],
    controllers : [UserController],
    providers : [UserService]
})
export class UserModule {}
