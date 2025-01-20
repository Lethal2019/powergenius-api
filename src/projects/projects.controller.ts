import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './projects.entity';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get()
    async findAll(): Promise<Projects[]> {
        return await this.projectsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Projects> {
        return await this.projectsService.findOne(+id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() projects: Projects): Promise<Projects> {
        return await this.projectsService.create(projects);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateData: Partial<Projects>,
    ): Promise<Projects> {
        return await this.projectsService.update(+id, updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        return await this.projectsService.remove(+id);
    }
}
