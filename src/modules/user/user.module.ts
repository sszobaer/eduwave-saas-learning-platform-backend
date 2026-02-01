import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/modules/user/user.controller';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from 'src/common/guards/role.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthModule,
    ],
    controllers : [UserController],
    providers : [UserService, RolesGuard]
})
export class UserModule {}
