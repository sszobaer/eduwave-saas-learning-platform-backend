import {IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateOrgDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    org_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    domain: string;
}