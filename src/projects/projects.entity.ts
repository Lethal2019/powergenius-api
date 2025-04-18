import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Projects{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    project_name: string;

    @Column({type: 'text'})
    project_description: string;

    @Column({nullable: true})
    project_image: string;

    @CreateDateColumn({type: 'timestamp'})
    created_date: Date;

    @UpdateDateColumn({type: 'timestamp'})
    modified_date: Date;
}