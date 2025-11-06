import {IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateOrgDto {
    @IsString()
    @IsNotEmpty({'message': 'Organization name should not be empty'})
    @MinLength(4)
    @MaxLength(15)
    org_name: string;
}