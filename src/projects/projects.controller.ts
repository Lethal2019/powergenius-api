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
  UploadedFiles,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './projects.entity';
import { Public } from 'src/auth/SkipAuth';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { Express } from 'express';

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
  @UseInterceptors(
    FilesInterceptor('project_images', 6, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${path.parse(file.originalname).name}${path.extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() project: Partial<Projects>,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Projects> {
    return this.projectsService.create(project, files);
  }

  @Public()
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('project_images', 6, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${path.parse(file.originalname).name}${path.extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Projects>,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Projects> {
    return this.projectsService.update(+id, updateData, files);
  }

  @Public()
  @Get('projects/random')
  async getRandomProjects() {
    return this.projectsService.getRandomProjects();
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(+id);
  }
}
