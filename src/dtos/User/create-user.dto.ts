import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    role_id: number;

    @IsNotEmpty({"message": "Name must not be empty"})
    @IsString()
    full_name: string;

    @IsOptional()
    @IsString()
    profile_img?: string;

    @IsBoolean()
    isActive: boolean;
}