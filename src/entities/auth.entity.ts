import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('Auth')
export class Auth {
    @PrimaryGeneratedColumn()
    auth_id: string;

    @Column({type: 'varchar', length: 255, unique: true})
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @OneToOne(()=>User, (user)=> user.auth, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({ type: 'timestamp', nullable: true })
    last_login: Date;
}