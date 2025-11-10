import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('userCredential')
export class UserCredential {
    @PrimaryGeneratedColumn()
    credential_id: string;

    @Column({type: 'varchar', length: 255, unique: true})
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @OneToOne(()=>User, (user)=> user.credential, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({ type: 'timestamp', nullable: true })
    last_login: Date;
}