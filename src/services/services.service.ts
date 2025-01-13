import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from './service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Services)
        private servicesRepository: Repository<Services>,
    ) {}

    findAll(): Promise<Services[]> {
        return this.servicesRepository.find();
    }

    findOne(id: number): Promise<Services> {
        return this.servicesRepository.findOneBy({id});
    }

    create(services: Services): Promise<Services> {
        return this.servicesRepository.save(services);
    }

    async removeEventListener(id: number): Promise <void> {
        await this.servicesRepository.delete(id);
    }
}
