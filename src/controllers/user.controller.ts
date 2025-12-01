import { Body, Controller, Get, Delete, Param, ParseIntPipe, Put, Req, UseGuards} from "@nestjs/common";

import { UpdateUserDto } from "src/dtos/User/update-user.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { UserService } from "src/services/user.service";

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) { }

    @UseGuards(AuthGuard)
    @Get('getallusers')
    findAllUsers(@Req() req) {
        console.log('====================================');
        console.log("Logged in user", req.user);
        console.log('====================================');
        return this.UserService.findAll();
    }
    @Put(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() data:UpdateUserDto ){
        return await this.UserService.update(id, data);
    }

    @Get(':id')
    async findOneUser(@Param('id', ParseIntPipe) id: number) {
        return await this.UserService.findOne(id);
    }
    @Delete(':id')
    async removeUser(@Param("id") id: number) {
        return await this.UserService.remove(id);
    }
}