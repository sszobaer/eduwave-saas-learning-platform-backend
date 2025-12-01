import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from 'src/controllers/role.controller';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { RoleService } from 'src/services/role.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission])],
    controllers: [RoleController],
    providers: [RoleService],
})
export class RoleModule {}
