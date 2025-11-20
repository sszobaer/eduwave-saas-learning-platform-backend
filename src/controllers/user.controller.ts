import { Body, Controller, Post, Get, Delete, Param, ParseIntPipe, Put } from "@nestjs/common";
import { diskStorage, MulterError } from "multer";
import { CreateUserDto } from "src/dtos/User/create-user.dto";
import { UpdateUserDto } from "src/dtos/User/update-user.dto";
import { UserService } from "src/services/user.service";

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) { }

    @Get()
    findAllUsers() {
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