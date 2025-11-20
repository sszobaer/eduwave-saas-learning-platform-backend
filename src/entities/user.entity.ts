import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import {UserCredential } from "./user-credentital.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @ManyToOne(()=>Role, (Role) => Role.users, {
        onDelete : 'CASCADE',
    })
    @JoinColumn({name: 'role_id'})
    role:Role;

    @OneToOne(()=>UserCredential, (credential)=>credential.user)
    credential: UserCredential;
    
    @Column({type: 'varchar', length: 30})
    full_name: string;

    @Column({type: 'text', nullable: true})
    profile_img: string;

    @Column({default: true})
    isActive: boolean;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;
}