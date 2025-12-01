import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import {UserCredential } from "./user-credentital.entity";
import { RefreshToken } from "./refresh-token.entity";

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

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];


    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;
}