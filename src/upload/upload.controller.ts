import { Controller, Post, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Public } from 'src/auth/SkipAuth';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))  // Default field is 'file'
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() request) {
    // You can check for dynamic fields via the request body if needed
    const fieldName = request.body.fieldName || 'file';  // Field name in the body (optional)
    
    if (file) {
      // You can log fieldName to check which field is being passed
      console.log('Field Name:', fieldName);
      
      // Upload the file using the CloudinaryService
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      return { imageUrl };
    } else {
      throw new Error('No file uploaded');
    }
  }
}
