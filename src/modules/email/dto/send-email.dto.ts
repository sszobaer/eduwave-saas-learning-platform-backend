import { IsEmail, IsString, IsOptional } from 'class-validator';

export class SendEmailDto {
  

  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  template: string;

  @IsOptional()
  context?: Record<string, any>;
}
