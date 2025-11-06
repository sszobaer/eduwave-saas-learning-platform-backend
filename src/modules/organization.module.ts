import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from 'src/controllers/organization.controller';
import { Organization } from 'src/entities/organization.entity';
import { OrganizationService } from 'src/services/organization.service';

@Module({
    imports : [TypeOrmModule.forFeature([Organization])],
    controllers : [OrganizationController],
    providers : [OrganizationService]
})
export class OrganizationModule {}
