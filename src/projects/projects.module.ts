import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './projects.entity';
import { ProjectImage } from './projectsImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Projects, ProjectImage])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports:[ProjectsService]
})
export class ProjectsModule {}
