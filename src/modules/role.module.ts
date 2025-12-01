import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from 'src/controllers/role.controller';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { RolesGuard } from 'src/guards/role.guard';
import { RoleService } from 'src/services/role.service';
import { AuthModule } from './auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission]),
    AuthModule
],
    controllers: [RoleController],
    providers: [RoleService, RolesGuard],
})
export class RoleModule {}
