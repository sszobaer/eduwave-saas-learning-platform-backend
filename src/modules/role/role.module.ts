import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from 'src/modules/role/role.controller';
import { Permission } from 'src/modules/role/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { RolesGuard } from 'src/common/guards/role.guard';
import { RoleService } from 'src/modules/role/role.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission]),
    AuthModule
],
    controllers: [RoleController],
    providers: [RoleService, RolesGuard],
})
export class RoleModule {}
