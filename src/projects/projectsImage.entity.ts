import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { Projects } from './projects.entity';
  
  @Entity()
  export class ProjectImage {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    url: string;
  
    @ManyToOne(() => Projects, (project) => project.images, { onDelete: 'CASCADE' })
    project: Projects;
  }
  