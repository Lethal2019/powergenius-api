import { 
    Controller, 
    Get, 
    Post, 
    Patch, 
    Delete, 
    Param, 
    Body, 
    HttpCode, 
    HttpStatus, 
    UseInterceptors, 
    UploadedFile 
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Services } from './service.entity';
import { Public } from 'src/auth/SkipAuth';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import {Multer} from 'multer';

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
    @UseInterceptors(FileInterceptor('service_image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const filename = `${Date.now()}-${path.parse(file.originalname).name}${path.extname(file.originalname)}`;
                cb(null, filename);
            },
        }),
    }))
    async create(
        @Body() services: Partial<Services>,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Services> {
        services.service_image = file ? `/uploads/${file.filename}` : null;
        return await this.servicesService.create(services as Services);
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
