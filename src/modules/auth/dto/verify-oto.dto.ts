import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

// OTP Verification DTO
export class VerifyOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}