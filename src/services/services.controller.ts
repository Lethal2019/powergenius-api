import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Services } from './service.entity';
import { Public } from 'src/auth/SkipAuth';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Public()
    @Get()
    async findAll(): Promise<Services[]> {
        return await this.servicesService.findAll();
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Services> {
        return await this.servicesService.findOne(+id);
    }

    @Public()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() services: Services): Promise<Services> {
        return await this.servicesService.create(services);
    }

    @Public()
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateData: Partial<Services>,
    ): Promise<Services> {
        return await this.servicesService.update(+id, updateData);
    }

    @Public()
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        return await this.servicesService.remove(+id);
    }
}
