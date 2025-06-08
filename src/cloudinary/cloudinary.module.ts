import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service'; // Make sure this path is correct

@Module({
  providers: [CloudinaryService], // Declare CloudinaryService as a provider
  exports: [CloudinaryService],   // Make CloudinaryService available for other modules to import
})
export class CloudinaryModule {}