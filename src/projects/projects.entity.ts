import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProjectImage } from './projectsImage.entity';

@Entity()
export class Projects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  project_name: string;

  @Column({ type: 'text' })
  project_description: string;

  @OneToMany(() => ProjectImage, (image) => image.project, {
    cascade: true,
    eager: true, // Automatically load images when fetching a project
  })
  images: ProjectImage[];

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modified_date: Date;
}
