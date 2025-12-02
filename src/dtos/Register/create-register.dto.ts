import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { Role } from "src/Utils/user-role.enum";


export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    @Matches(/^[A-Za-z\s]+$/, { message: 'Name must be contain only alphabets' })
    full_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[A-Z]).{8,}$/, {
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter.',
    })
    password: string;


    @IsOptional()
    @IsString()
    profile_img?: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(Role, {message: "Enter a valid role."})
    role_name: string;
}