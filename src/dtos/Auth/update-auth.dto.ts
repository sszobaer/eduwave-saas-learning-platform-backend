import { IsOptional, IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateAuthDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
