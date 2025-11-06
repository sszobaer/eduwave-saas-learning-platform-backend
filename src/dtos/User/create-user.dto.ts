import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    @IsNumber()
    org_id: number;

    @IsNotEmpty()
    @IsNumber()
    role_id: number;

    @IsNotEmpty({"message": "Name must not be empty"})
    @IsString()
    full_name: string;

    @IsNotEmpty()
    @IsString()
    profile_img: string;
}