import { Body, Controller, Get, Param, Post, Put, Delete } from "@nestjs/common";
import { CreateRoleDto } from "src/dtos/Role/create-role.dto";
import { UpdateRoleDto } from "src/dtos/Role/update-role.dto";
import { RoleService } from "src/services/role.service";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post('create')
    CreateRole(@Body() data: CreateRoleDto) {
        return this.roleService.create(data);
    }
    @Get()
    findAllRoles() {
        return this.roleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.roleService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: UpdateRoleDto) {
        return this.roleService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.roleService.remove(id);
    }
}