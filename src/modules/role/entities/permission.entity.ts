// permission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity('permission')
export class Permission {
    @PrimaryGeneratedColumn()
    permission_id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];
}
