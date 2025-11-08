import { Body, Controller, Get, Param, Post, Put, Delete } from "@nestjs/common";
import { CreateRoleDto } from "src/dtos/Role/create-role.dto";
import { UpdateRoleDto } from "src/dtos/Role/update-role.dto";
import { RoleService } from "src/services/role.service";

@Controller('role')
export class RoleController {
    constructor(private readonly RoleService: RoleService) { }

    @Post('create')
    async CreateRole(@Body() data: CreateRoleDto) {
        return await this.RoleService.create(data);
    }
    @Get()
    async findAllRoles() {
        return await this.RoleService.findAll();
    }

    @Get(':id')
    async findOneRole(@Param('id') id: number) {
        return await this.RoleService.findOne(id);
    }

    @Put(':id')
    async updateRole(@Param('id') id: number, @Body() data: UpdateRoleDto) {
        return await this.RoleService.update(id, data);
    }

    @Delete(':id')
    async removeRole(@Param('id') id: number) {
        return await this.RoleService.remove(id);
    }
}