import { IsOptional, IsString, IsInt, IsUrl, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsInt()
  org_id?: number;

  @IsOptional()
  @IsInt()
  role_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  full_name?: string;

  @IsOptional()
  @IsUrl()
  profile_img?: string;
}
