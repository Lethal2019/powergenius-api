import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from './projects.entity';
import { Repository } from 'typeorm';
import { ProjectImage } from './projectsImage.entity';

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

  async create(data: {
    project_name: string;
    project_description: string;
    imageUrls: string[];
  }): Promise<Projects> {
    const { project_name, project_description, imageUrls } = data;

    const project = this.projectsRepository.create({
      project_name,
      project_description,
    });
    const savedProject = await this.projectsRepository.save(project);

    const images = imageUrls.map((url) =>
      this.projectImageRepository.create({
        url,
        project: savedProject,
      }),
    );
    await this.projectImageRepository.save(images);

    return this.findOne(savedProject.id);
  }

  async update(id: number, data: {
    project_name?: string;
    project_description?: string;
    imageUrls?: string[];
  }): Promise<Projects> {
    const project = await this.findOne(id);

    // Update text fields
    if (data.project_name) project.project_name = data.project_name;
    if (data.project_description) project.project_description = data.project_description;

    await this.projectsRepository.save(project);

    // Replace images if provided
    if (data.imageUrls && data.imageUrls.length > 0) {
      await this.projectImageRepository.delete({ project: { id } });

      const newImages = data.imageUrls.map((url) =>
        this.projectImageRepository.create({
          url,
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
