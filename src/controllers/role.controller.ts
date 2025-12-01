import { Body, Controller, Get, Param, Post, Put, Delete, ParseIntPipe, UseGuards, Req } from "@nestjs/common";

import { Roles } from "src/decorators/roles.decorator";
import { CreateRoleDto } from "src/dtos/Role/create-role.dto";
import { UpdateRoleDto } from "src/dtos/Role/update-role.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { RoleService } from "src/services/role.service";

@Controller('role')
export class RoleController {
    constructor(private readonly RoleService: RoleService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Post('create')
    async CreateRole(@Req() @Body() data: CreateRoleDto) {
        return await this.RoleService.create(data);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Get('getall')
    async findAllRoles(@Req() req) {
        console.log(req);
        return await this.RoleService.findAll();
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Get('findone/:id')
    async findOneRole(@Req() @Param('id', ParseIntPipe) id: number) {
        return await this.RoleService.findOne(id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Put('update/:id')
    async updateRole(@Req() @Param('id', ParseIntPipe) id: number, @Body() data: UpdateRoleDto) {
        return await this.RoleService.update(id, data);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Delete('delete/:id')
    async removeRole(@Req() @Param('id', ParseIntPipe) id: number) {
        return await this.RoleService.remove(id);
    }
}