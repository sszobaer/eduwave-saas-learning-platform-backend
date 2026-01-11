import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z]).{8,}$/, {
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter.',
   })
  newPassword: string;
}
