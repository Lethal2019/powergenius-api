import {
  Controller,
  Post,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Public } from 'src/auth/SkipAuth';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Public()
  @Post('project')  // Handles multiple file uploads with additional data
  @UseInterceptors(FilesInterceptor('files', 6))
  async uploadProjectFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { project_name: string; project_description: string },
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    try {
      const imageUrls = [];
      for (const file of files) {
        const imageUrl = await this.cloudinaryService.uploadImage(file, 'project_images');
        imageUrls.push(imageUrl);
      }

      // You can now use body.project_name and body.project_description
      return {
        success: true,
        message: 'Project images uploaded successfully',
        data: {
          project_name: body.project_name,
          project_description: body.project_description,
          imageUrls,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Error uploading files: ${error.message}`);
    }
  }

  @Public()
  @Post('service')  // Single file upload for service images
  @UseInterceptors(FileInterceptor('file'))
  async uploadServiceFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const imageUrl = await this.cloudinaryService.uploadImage(file, 'service_images');
      return {
        success: true,
        message: 'Service image uploaded successfully',
        data: { imageUrl },
      };
    } catch (error) {
      throw new BadRequestException(`Error uploading file: ${error.message}`);
    }
  }
}
