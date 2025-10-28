import { Body, Controller, Post, Get, Param, Delete, Put } from "@nestjs/common";
import { CreateOrgDto } from "src/dtos/Organization/create-organization.dto";
import { UpdateOrg } from "src/dtos/Organization/update-organization.dto";
import { OrganizationService } from "src/services/organization.service";

@Controller('org')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}
    @Post('create')
    craete(@Body() data: CreateOrgDto){
        return this.organizationService.create(data);
    }

    @Get()
    findAll(){
        return this.organizationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:number){
        return this.organizationService.findOne(id);
    }
    
    @Put(':id')
    update(@Param('id') id: number, @Body() data: UpdateOrg){
        return this.organizationService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.organizationService.remove(id);
    }
}