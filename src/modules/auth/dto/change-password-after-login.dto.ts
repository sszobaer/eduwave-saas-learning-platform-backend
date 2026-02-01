import { IsNotEmpty, IsString, Matches } from "class-validator";

export class ChangePasswordAfterLoginDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
    @Matches(/^(?=.*[A-Z]).{8,}$/, {
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter.',
     })
  newPassword: string;
}
