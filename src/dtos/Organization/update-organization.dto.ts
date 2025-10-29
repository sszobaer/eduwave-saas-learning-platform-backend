import { PartialType } from "@nestjs/mapped-types";
import { CreateOrgDto } from "./create-organization.dto";
import { IsNotEmpty, IsString, MaxLength  } from "class-validator";

export class UpdateOrg extends PartialType(CreateOrgDto) {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    domain: string;
}