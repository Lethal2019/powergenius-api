// src/services/services.controller.ts
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
  BadRequestException // Added for better error handling
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Services } from './service.entity';
import { Public } from 'src/auth/SkipAuth'; // Assuming this is for public access
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // <-- Import CloudinaryService

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly cloudinaryService: CloudinaryService, // <-- Inject CloudinaryService
  ) {}

  @Public()
  @Get()
  async findAll(): Promise<Services[]> {
    return await this.servicesService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Services> {
    return await this.servicesService.findOne(+id);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('service_image')) // Multer will now keep file in memory as buffer
  async create(
    @Body() servicesData: { service_name: string; service_description: string }, // Explicitly define expected body
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Services> {
    if (!file) {
      throw new BadRequestException('Service image file is required.');
    }

    try {
      // Upload image to Cloudinary and get the URL
      const imageUrl = await this.cloudinaryService.uploadImage(file, 'service_images'); // 'service_images' is your folder

      // Create service object with Cloudinary URL
      const newService = new Services();
      newService.service_name = servicesData.service_name;
      newService.service_description = servicesData.service_description;
      newService.service_image_url = imageUrl; // <-- Store Cloudinary URL here!

      return await this.servicesService.create(newService);

    } catch (error) {
      // Handle Cloudinary upload errors
      throw new BadRequestException(`Failed to upload service image: ${error.message}`);
    }
  }

  @Public()
  @Patch(':id')
  @UseInterceptors(FileInterceptor('service_image')) // Multer will now keep file in memory as buffer
  async update(
    @Param('id') id: string,
    @Body() updateData: { service_name?: string; service_description?: string }, // Explicitly define expected body
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Services> {
    const serviceToUpdate = await this.servicesService.findOne(+id); // Get existing service

    if (file) {
      try {
        // Upload new image to Cloudinary
        const newImageUrl = await this.cloudinaryService.uploadImage(file, 'service_images');

        // Optional: Delete old image from Cloudinary if needed (requires storing public_id)
        // If serviceToUpdate.service_image_public_id exists, call cloudinaryService.deleteImage(...)

        serviceToUpdate.service_image_url = newImageUrl; // <-- Update with new Cloudinary URL
      } catch (error) {
        throw new BadRequestException(`Failed to update service image: ${error.message}`);
      }
    }

    // Update other fields
    if (updateData.service_name) {
      serviceToUpdate.service_name = updateData.service_name;
    }
    if (updateData.service_description) {
      serviceToUpdate.service_description = updateData.service_description;
    }

    return await this.servicesService.update(+id, serviceToUpdate);
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    // Optional: Fetch the service to get the Cloudinary public_id
    // If you store public_id, you can delete the image from Cloudinary here
    // const service = await this.servicesService.findOne(+id);
    // if (service.service_image_public_id) {
    //   await this.cloudinaryService.deleteImage(service.service_image_public_id);
    // }
    return await this.servicesService.remove(+id);
  }
}