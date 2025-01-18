import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from './projects.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Projects)
        private projectsRepository: Repository<Projects>,
    ) {}

    async findAll(): Promise<Projects[]> {
        return await this.projectsRepository.find();
    }

    async findOne(id: number): Promise<Projects> {
        const project = await this.projectsRepository.findOneBy({ id });
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found.`);
        }
        return project;
    }

    async create(project: Projects): Promise<Projects> {
        return await this.projectsRepository.save(project);
    }

    async update(id: number, updateData: Partial<Projects>): Promise<Projects> {
        const project = await this.findOne(id);
        return await this.projectsRepository.save({
            ...project,
            ...updateData,
        });
    }

    async remove(id: number): Promise<void> {
        const result = await this.projectsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project with ID ${id} not found.`);
        }
    }
}
