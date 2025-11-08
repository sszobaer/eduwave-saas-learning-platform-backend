import { Body, Controller, Post, Get, Delete, Param, UseInterceptors, BadRequestException, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";
import { CreateUserDto } from "src/dtos/User/create-user.dto";
import { UserService } from "src/services/user.service";

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) { }
    @Post('create')
    @UseInterceptors(
        FileInterceptor('profile_img', {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/)) cb(null, true);
                else cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'profile_img'), false);
            },
            limits: { fileSize: 2 * 1024 * 1024 },
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    cb(null, Date.now() + '-' + file.originalname);
                },
            }),
        }),
    )
    async createUser(
        @UploadedFile() file: Express.Multer.File,
        @Body() data: CreateUserDto) {
        if (!file) throw new BadRequestException('Profile image is required');

        data.profile_img = `/uploads/${file.filename}`;
        return await this.UserService.create(data);
    }

    @Get()
    findAllUsers() {
        return this.UserService.findAll();
    }

    @Get(':id')
    async findOneUser(@Param('id') id: number) {
        return await this.UserService.findOne(id);
    }
    @Delete(':id')
    async removeUser(@Param('id') id: number) {
        return await this.UserService.remove(id);
    }
}