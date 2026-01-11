import { Body, Controller, Get, Delete, Param, ParseIntPipe, Put, Req, UseGuards } from "@nestjs/common";
import { Roles } from "src/decorators/roles.decorator";

import { UpdateUserDto } from "src/dtos/User/update-user.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { UserService } from "src/services/user.service";

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('getall')
    findAllUsers(@Req() req) {
        console.log("Logged in user", req.user);
        return this.UserService.findAll();
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Put(':id')
    async updateUser(@Req() @Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
        return await this.UserService.update(id, data);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('getone/:id')
    async findOneUser(@Req() @Param('id', ParseIntPipe) id: number) {
        return await this.UserService.findOne(id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete('delete/:id')
    async removeUser(@Req() @Param("id") id: number) {
        return await this.UserService.remove(id);
    }
}