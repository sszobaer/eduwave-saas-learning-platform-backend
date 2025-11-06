import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
