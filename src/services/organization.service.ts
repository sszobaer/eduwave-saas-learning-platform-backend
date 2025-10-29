import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOrgDto } from "src/dtos/Organization/create-organization.dto";
import { UpdateOrg } from "src/dtos/Organization/update-organization.dto";
import { Organizations } from "src/entities/organization.entity";
import { generateOrgDomain } from "src/Utils/org.util";
import { Repository } from "typeorm";

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organizations)
        private readonly orgRepo: Repository<Organizations>
    ) { }

    //Problem here I am not able to use Try Catch
    async create(data: CreateOrgDto): Promise<Organizations> {
        // try {
        const exists = await this.orgRepo.findOne({ where: { org_name: data.org_name } });
        if (exists) {
            throw new BadRequestException("Organization already exists");
        }
        
        const domain = generateOrgDomain(data.org_name);


        const org = this.orgRepo.create({
            ...data,
            domain,
        });
        return this.orgRepo.save(org);
        // } catch(err){
        //     throw err;
        // }

    }

    async findAll(): Promise<Organizations[]> {
        const allOrg = await this.orgRepo.find();
        if (!allOrg) {
            throw new NotFoundException('No Organization found');
        }
        return allOrg;
    }

    async findOne(id: number): Promise<Organizations> {
        const org = await this.orgRepo.findOne({ where: { org_id: id } });
        if (!org) {
            throw new NotFoundException(`Organization Not Found. Try again`);
        }
        return org;
    }

    async update(id: number, data: UpdateOrg): Promise<Organizations> {
        const org = await this.findOne(id);

        if(!org){
            throw new NotFoundException(`Organization Not Found. Try again`);
        }

        if (data.org_name) {
            data.domain = generateOrgDomain(data.org_name);
        }
        //(Destination, ...Source)
        Object.assign(org, data);
        return this.orgRepo.save(org);
    }

    async remove(id: number): Promise<void> {
        const response = await this.orgRepo.delete(id);

        if (response.affected === 0) {
            throw new NotFoundException(`Organization Not Found. Try again`);
        }
    }
}