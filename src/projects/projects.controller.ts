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
    UploadedFile,
  } from '@nestjs/common';
  import { ProjectsService } from './projects.service';
  import { Projects } from './projects.entity';
  import { Public } from 'src/auth/SkipAuth';
  import { FileInterceptor } from '@nestjs/platform-express';
  import * as path from 'path';
  import { diskStorage } from 'multer';
  import { Express } from 'express';
  
  @Controller('projects')
  export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}
  
    @Public()
    @Get()
    async findAll(): Promise<Projects[]> {
      return await this.projectsService.findAll();
    }
  
    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Projects> {
      return await this.projectsService.findOne(+id);
    }
  
    @Public()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('project_image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${path.parse(file.originalname).name}${path.extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }))
    async create(
      @Body() project: Partial<Projects>,
      @UploadedFile() file: Express.Multer.File,
    ): Promise<Projects> {
      project.project_image = file ? `/uploads/${file.filename}` : null;
      return await this.projectsService.create(project as Projects);
    }
  
    @Public()
    @Patch(':id')
    @UseInterceptors(FileInterceptor('project_image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${path.parse(file.originalname).name}${path.extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }))
    async update(
      @Param('id') id: string,
      @Body() updateData: Partial<Projects>,
      @UploadedFile() file?: Express.Multer.File,
    ): Promise<Projects> {
      if (file) {
        updateData.project_image = `/uploads/${file.filename}`;
      }
      return await this.projectsService.update(+id, updateData);
    }
  
  
    @Public()
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
      return await this.projectsService.remove(+id);
    }
  }
  