import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './projects.entity';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectService: ProjectsService) {}

    @Get()
    findAll(): Promise<Projects[]> {
        return this.projectService.findAll();
    }
    @Get(':id')
    findOne(@Param('id')id: string): Promise<Projects> {
        return this.projectService.findOne(+id);
    }

    @Post()
    create(@Body() services: Projects): Promise<Projects> {
        return this.projectService.create(services);
    }

    @Delete()
    remove(@Param('id') id: number): Promise<void> {
        return this.projectService.removeEventListener(+id);
    }
}
