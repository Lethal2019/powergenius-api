import { Injectable } from '@nestjs/common';
import { Projects } from './projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Projects)
        private projectRepository: Repository<Projects>,
    ) {}

    findAll(): Promise<Projects[]> {
        return this.projectRepository.find();
    }

    findOne(id: number): Promise<Projects> {
        return this.projectRepository.findOneBy({id});
    }

    create(project: Projects): Promise<Projects> {
        return this.projectRepository.save(project);
    }

    async removeEventListener(id: number): Promise <void> {
        await this.projectRepository.delete(id);
    }
}
