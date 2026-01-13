import { Body, Controller, Get, Delete, Param, ParseIntPipe, Put, Req, UseGuards, Patch } from "@nestjs/common";
import { Request } from "express";
import { Roles } from "src/decorators/roles.decorator";

import { UpdateUserDto } from "src/dtos/User/update-user.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { UserService } from "src/services/user.service";

@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users/')
export class AdminUserController {
    authService: any;
    constructor(private readonly UserService: UserService
    ) { }


    @Patch('block/:id')
    blockUser(@Param('id') id: number) {
        return this.UserService.blockUser(+id);
    }

    @Patch('unblock/:id')
    unblockUser(@Param('id') id: number) {
        return this.UserService.unblockUser(+id);
    }
    @Get('getall')
    findAllUsers(@Req() req) {
        console.log("Logged in user", req.user);
        return this.UserService.findAll();
    }

    @Put(':id')
    async updateUser(@Req() @Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
        return await this.UserService.update(id, data);
    }

    @Get('getone/:id')
    async findOneUser(@Req() @Param('id', ParseIntPipe) id: number) {
        return await this.UserService.findOne(id);
    }

    @Delete('delete/:id')
    async removeUser(@Req() @Param("id") id: number) {
        return await this.UserService.remove(id);
    }
}