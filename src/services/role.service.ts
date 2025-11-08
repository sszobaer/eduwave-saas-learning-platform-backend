import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoleDto } from "src/dtos/Role/create-role.dto";
import { UpdateRoleDto } from "src/dtos/Role/update-role.dto";
import { Role } from "src/entities/role.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleService {
    constructor (
        @InjectRepository(Role)
         private readonly roleRepo: Repository<Role>
        ) {}

    async create(data: CreateRoleDto): Promise<Role> {
        const exists = await this.roleRepo.findOneBy({ role_name: data.role_name });
        if (exists)  throw new BadRequestException("Role already exists");

        const role = this.roleRepo.create(data);
        return this.roleRepo.save(role);
    }

    async findAll(): Promise<Role[]> {
        const allRoles = await this.roleRepo.find();
        if (!allRoles.length) throw new BadRequestException('No Roles found');
        return allRoles;
    }

    async findOne(id: number) : Promise<Role>{
        const role = await this.roleRepo.findOneBy({role_id: id });

        if(!role) throw new BadRequestException(`No roles with this ${id} exist`);

        return role;
    }

    async update(id: number, data: UpdateRoleDto): Promise<Role> {
        const role = await this.findOne(id);
        if(!role) throw new NotFoundException(`Role Not Found. Try again`);

        Object.assign(role,data);
        return this.roleRepo.save(role);
    }

    async remove(id: number): Promise<void> {
        const response = await this.roleRepo.delete(id);

        if (response.affected === 0) throw new NotFoundException(`role Not Found. Try again`);
    }
}