import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Organizations {
    @PrimaryGeneratedColumn()
    org_id: number;

    @Column()
    org_name: string;

    @Column()
    domain: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}