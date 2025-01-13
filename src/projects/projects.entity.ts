import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Projects{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    project_name: string;

    @Column({type: 'text'})
    project_description: string;
}