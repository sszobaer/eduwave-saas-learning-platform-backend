import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { RegisterDto } from 'src/dtos/Register/create-register.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) { }

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
    register(
        @UploadedFile() file: Express.Multer.File,
        @Body() data: RegisterDto
    ) {
        if (!file) throw new BadRequestException('Profile image is required');

        data.profile_img = `/uploads/${file.filename}`;
        return this.AuthService.register(data);
    }
}
