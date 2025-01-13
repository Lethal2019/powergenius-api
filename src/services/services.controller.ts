import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Services } from './service.entity';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Get()
    findAll(): Promise<Services[]> {
        return this.servicesService.findAll();
    }
    @Get(':id')
    findOne(@Param('id')id: string): Promise<Services> {
        return this.servicesService.findOne(+id);
    }

    @Post()
    create(@Body() services: Services): Promise<Services> {
        return this.servicesService.create(services);
    }

    @Delete()
    remove(@Param('id') id: number): Promise<void> {
        return this.servicesService.removeEventListener(+id);
    }
}
