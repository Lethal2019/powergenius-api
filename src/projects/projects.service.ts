import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from './projects.entity';
import { Repository } from 'typeorm';
import { ProjectImage } from './projectsImage.entity';
import { Express } from "express";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private projectsRepository: Repository<Projects>,
    @InjectRepository(ProjectImage)
    private projectImageRepository: Repository<ProjectImage>,
  ) {}

  async findAll(): Promise<Projects[]> {
    return this.projectsRepository.find({ relations: ['images'] });
  }

  async findOne(id: number): Promise<Projects> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return project;
  }

  async create(data: Partial<Projects>, imageFiles: Express.Multer.File[]): Promise<Projects> {
    const project = this.projectsRepository.create(data);
    const savedProject = await this.projectsRepository.save(project);

    const images = imageFiles.map((file) =>
      this.projectImageRepository.create({
        url: `/uploads/${file.filename}`,
        project: savedProject,
      }),
    );
    await this.projectImageRepository.save(images);

    return this.findOne(savedProject.id);
  }

  async update(id: number, data: Partial<Projects>, imageFiles?: Express.Multer.File[]): Promise<Projects> {
    const project = await this.findOne(id);

    // Update project fields
    Object.assign(project, data);
    await this.projectsRepository.save(project);

    // Optional: remove old images if you're replacing
    if (imageFiles?.length) {
      await this.projectImageRepository.delete({ project: { id } });

      const newImages = imageFiles.map((file) =>
        this.projectImageRepository.create({
          url: `/uploads/${file.filename}`,
          project,
        }),
      );
      await this.projectImageRepository.save(newImages);
    }

    return this.findOne(id);
  }

  async getRandomProjects(limit = 6): Promise<Projects[]> {
    return this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.images', 'images')
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
  }
}
