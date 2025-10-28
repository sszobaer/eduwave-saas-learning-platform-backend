import { Controller } from "@nestjs/common";
import { RoleService } from "src/services/role.service";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}
}