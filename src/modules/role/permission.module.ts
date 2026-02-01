import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/modules/role/entities/permission.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Permission])]
})
export class PermissionModule {}
