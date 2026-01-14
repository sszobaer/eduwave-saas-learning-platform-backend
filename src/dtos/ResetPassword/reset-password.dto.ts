import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    resetToken: string; // Added resetToken

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[A-Z]).{8,}$/, {
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter.',
    })
    newPassword: string;
}

