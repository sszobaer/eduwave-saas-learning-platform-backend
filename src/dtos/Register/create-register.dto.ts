import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Role } from "src/Utils/user-role.enum";


export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(8)
    @Matches(/^[A-Za-z\s]+$/, { message: 'Name must be contain only alphabets' })
    full_name: string;

    @IsNotEmpty()
    @IsEmail()
    @Matches(/@.*\.org$/, { message: 'Email must contain @ and .org domain' })
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

    // @IsNotEmpty()
    // @Matches(/^01\d{9}$/, {
    //     message: 'Phone number must start with 01 and be exactly 11 digits long.',
    // })
    // phone: string;
}