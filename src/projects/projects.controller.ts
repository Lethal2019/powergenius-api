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
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './projects.entity';
import { Public } from 'src/auth/SkipAuth';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  async findAll(): Promise<Projects[]> {
    return this.projectsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Projects> {
    return this.projectsService.findOne(+id);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: {
      project_name: string;
      project_description: string;
      imageUrls: string[];
    },
  ): Promise<Projects> {
    return this.projectsService.create(body);
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      project_name?: string;
      project_description?: string;
      imageUrls?: string[];
    },
  ): Promise<Projects> {
    return this.projectsService.update(+id, body);
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(+id);
  }
}
