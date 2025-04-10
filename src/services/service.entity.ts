import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Services{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    service_name: string;

    @Column({type: 'text'})
    service_description: string;

    @Column({nullable: true})
    service_image: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_date: Date;
}