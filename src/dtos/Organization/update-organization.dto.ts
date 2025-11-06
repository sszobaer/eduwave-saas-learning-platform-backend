import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOrg {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  org_name?: string;

  @IsOptional()
  @IsString()
  domain?: string;
}
