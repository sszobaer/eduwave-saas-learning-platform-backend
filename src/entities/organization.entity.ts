import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Organization {
    @PrimaryGeneratedColumn()
    org_id: number;

    @Column()
    org_name: string;

    @Column()
    domain: string;

    @OneToMany(() => User, (user) => user.organization)
    users: User[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}