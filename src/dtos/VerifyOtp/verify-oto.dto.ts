import { IsEmail, IsString, IsNotEmpty, Matches } from 'class-validator';

// OTP Verification DTO
export class VerifyOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}