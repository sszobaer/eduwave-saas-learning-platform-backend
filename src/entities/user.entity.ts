import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { Auth } from "./auth.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @ManyToOne(()=>Role, (Role) => Role.users, {
        onDelete : 'CASCADE',
    })
    @JoinColumn({name: 'role_id'})
    role:Role;

    @OneToOne(()=>Auth, (auth)=>auth.user)
    auth: Auth;
    
    @Column({type: 'varchar', length: 30})
    full_name: string;

    @Column({type: 'text', nullable: true})
    profile_img: string;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;
}