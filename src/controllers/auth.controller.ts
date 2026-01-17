import { BadRequestException, Body, Controller, Post, Res, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { LoginDto } from 'src/dtos/Login/login.dto';
import { RegisterDto } from 'src/dtos/Register/create-register.dto';
import { AuthService } from 'src/services/auth.service';
import { ForgotPasswordDto } from 'src/dtos/ForgotPassword/forgot-password.dto';
import { VerifyOtpDto } from 'src/dtos/VerifyOtp/verify-oto.dto';
import { ResetPasswordDto } from 'src/dtos/ResetPassword/reset-password.dto';
import { UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { ChangePasswordAfterLoginDto } from "src/dtos/ChangePassword/change-password-after-login.dto";
import type { Response, Request } from 'express';

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}
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
  register(@UploadedFile() file: Express.Multer.File, @Body() data: RegisterDto) {
    if (!file) throw new BadRequestException('Profile image is required');

    data.profile_img = `/uploads/${file.filename}`;
    return this.AuthService.register(data);
  }


  @Post('login')
  async login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.AuthService.login(data);

    // Set refresh token in HttpOnly cookie
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return result;
  }


  @Post('refresh')
  refresh(@Req() req: RequestWithCookies) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    return this.AuthService.refreshTokens({ token: refreshToken });
  }



  // Forgot Password: Endpoint to send OTP to email
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const response = await this.AuthService.forgotPassword(forgotPasswordDto);
    return response; // Success message: OTP sent to email
  }

  // OTP Verification
  @Post('verify-otp')
  async verifyOtp(@Body() otpDto: VerifyOtpDto) {
    const response = await this.AuthService.verifyOtp(otpDto);
    return response; // Success message: OTP verified successfully
  }

    
  // Change Password: Endpoint to change password after OTP verification
  @Post('reset-password')
  async changePassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const response = await this.AuthService.resetPassword(resetPasswordDto);
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

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return { message: 'Logout successful' };
  }

}
