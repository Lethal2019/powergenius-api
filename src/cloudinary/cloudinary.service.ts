// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Returns the secure_url directly
  async uploadImage(file: Express.Multer.File, folder = 'general'): Promise<string> {
    const uploadOptions = { folder };

    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(`Error uploading to Cloudinary: ${error.message}`);
        } else {
          resolve(result?.secure_url || ''); // Resolves with the secure_url
        }
      });

      // Ensure file.buffer exists when using FileInterceptor without diskStorage
      if (file.buffer) {
        uploadStream.end(file.buffer);
      } else {
        // This 'else if (file.path)' block is typically not needed if you use memory storage
        // with FileInterceptor. Multer usually provides buffer for single file uploads.
        // It might be relevant if you're chaining multer storage options.
        // For simplicity, for direct Cloudinary upload, ensure you get the buffer.
        reject('File buffer not found. Ensure Multer is configured for memory storage.');
      }
    });
  }
}