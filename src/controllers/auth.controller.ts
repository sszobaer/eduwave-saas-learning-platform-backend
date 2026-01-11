import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { LoginDto } from 'src/dtos/Login/login.dto';
import { RefreshTokenDto } from 'src/dtos/RefreshToken/refreh-token.dto';
import { RegisterDto } from 'src/dtos/Register/create-register.dto';
import { AuthService } from 'src/services/auth.service';
import { ForgotPasswordDto } from 'src/dtos/ForgotPassword/forgot-password.dto';
import { ChangePasswordDto } from 'src/dtos/ChangePassword/change-password.dto';
import { UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { ChangePasswordAfterLoginDto } from "src/dtos/ChangePassword/change-password-after-login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) { }

    @Post('register')
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

    @Post('login')
    login(@Body() data:LoginDto){
       return this.AuthService.login(data);
    }

    @Post('refresh')
    refresh(@Body() data: RefreshTokenDto){
        return this.AuthService.refreshTokens(data);
    }

    // Forgot Password: Endpoint to send OTP to email
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const response = await this.AuthService.forgotPassword(forgotPasswordDto);
    return response; // Success message: OTP sent to email
    }

    // Change Password: Endpoint to change password after OTP verification
    @Post('change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const response = await this.AuthService.changePassword(changePasswordDto);
    return response; // Success message: Password updated successfully
  }

  @Post('change-password-after-login')
  @UseGuards(AuthGuard)
  changePasswordAfterLogin(
  @Req() req,
  @Body() data: ChangePasswordAfterLoginDto
  ) {
  return this.AuthService.changePasswordAfterLogin(req.user.sub, data);
  }
}
