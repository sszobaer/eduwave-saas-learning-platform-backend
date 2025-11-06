import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    role_id: number;

    @Column({length: 50})
    role_name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}