import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from './service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Services)
        private servicesRepository: Repository<Services>,
    ) {}

    async findAll(): Promise<Services[]> {
        return await this.servicesRepository.find();
    }

    async findOne(id: number): Promise<Services> {
        const service = await this.servicesRepository.findOneBy({ id });
        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found.`);
        }
        return service;
    }

    async create(services: Services): Promise<Services> {
        return await this.servicesRepository.save(services);
    }

    async update(id: number, updateData: Partial<Services>): Promise<Services> {
        const service = await this.findOne(id);
        return await this.servicesRepository.save({
            ...service,
            ...updateData,
        });
    }

    async remove(id: number): Promise<void> {
        const result = await this.servicesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Service with ID ${id} not found.`);
        }
    }
}
