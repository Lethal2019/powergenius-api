// src/services/services.module.ts
import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from './service.entity';
// import { ServeStaticModule } from '@nestjs/serve-static'; // <-- REMOVE THIS
// import { join } from 'path'; // <-- REMOVE THIS
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // <-- IMPORT THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([Services]),
    CloudinaryModule, // <-- Add CloudinaryModule here
    // REMOVE THIS BLOCK
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '..', 'uploads'),
    //   serveRoot: '/uploads',
    // }),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}