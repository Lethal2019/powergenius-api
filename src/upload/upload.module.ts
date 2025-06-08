// src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
// Make sure this path is correct if your CloudinaryModule is in a different location
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule], // Import CloudinaryModule to make CloudinaryService available
  controllers: [UploadController], // Declare UploadController
  // No need to export anything here unless other modules specifically need to use UploadController directly
})
export class UploadModule {}