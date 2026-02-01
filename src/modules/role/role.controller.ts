import { Body, Controller, Get, Param, Post, Put, Delete, ParseIntPipe, Req} from "@nestjs/common";

import { CreateRoleDto } from "src/modules/role/dto/create-role.dto";
import { UpdateRoleDto } from "src/modules/role/dto/update-role.dto";
import { RoleService } from "src/modules/role/role.service";

@Controller('role')
export class RoleController {
    constructor(private readonly RoleService: RoleService) { }

    @Post('create')
    async CreateRole(@Req() @Body() data: CreateRoleDto) {
        return await this.RoleService.create(data);
    }

    @Get('getall')
    async findAllRoles(@Req() req) {
        console.log(req);
        return await this.RoleService.findAll();
    }

    @Get('findone/:id')
    async findOneRole(@Req() @Param('id', ParseIntPipe) id: number) {
        return await this.RoleService.findOne(id);
    }

    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles('admin')
    @Put('update/:id')
    async updateRole(@Req() @Param('id', ParseIntPipe) id: number, @Body() data: UpdateRoleDto) {
        return await this.RoleService.update(id, data);
    }

    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles('admin')
    @Delete('delete/:id')
    async removeRole(@Req() @Param('id', ParseIntPipe) id: number) {
        return await this.RoleService.remove(id);
    }
}