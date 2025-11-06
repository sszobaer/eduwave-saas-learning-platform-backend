import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Organization } from "./organization.entity";
import { Role } from "./role.entity";
import { Auth } from "./auth.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: string;

    @OneToMany(()=> Organization, (Organization) => Organization.users,{
        onDelete : 'CASCADE',
    })
    @JoinColumn({ name: 'org_id' })
    organization: Organization;

    @OneToMany(()=>Role, (Role) => Role.role_id, {
        onDelete : 'CASCADE',
    })
    @JoinColumn({name: 'role_id'})
    role:Role;

    @OneToOne(()=>Auth, (auth)=>auth.user)
    auth: Auth;
    
    @Column({type: 'varchar', length: 30})
    full_name: string;

    @Column({type: 'text', nullable: true})
    profile_img?: string;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

}