import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user.entity";
import { Permission } from "./permission.entity";

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn()
    role_id: number;

    @Column({length: 50})
    role_name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @ManyToMany(() => Permission, permission => permission.roles)
    @JoinTable()
    permissions: Permission[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}