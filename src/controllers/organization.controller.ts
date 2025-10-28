import { Controller } from "@nestjs/common";
import { OrganizationService } from "src/services/organiation.service";

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}
}