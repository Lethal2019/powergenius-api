// src/services/service.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Services {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service_name: string;

  @Column({ type: "text" })
  service_description: string;

  // CHANGED: Renamed to clearly indicate it stores a URL
  // Also, consider adding a public_id if you plan to delete images from Cloudinary
  @Column({ nullable: true })
  service_image_url: string; // <-- Changed name

  @CreateDateColumn({ type: "timestamp" })
  created_date: Date;

  @UpdateDateColumn({ type: "timestamp" })
  modified_date: Date;
}