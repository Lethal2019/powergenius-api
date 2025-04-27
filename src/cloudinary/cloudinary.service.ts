import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const uploadOptions = {
      folder: 'service_image', 
    };

    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result: UploadApiResponse) => {
        if (error) {
          reject(`Error uploading to Cloudinary: ${error.message}`);
        }
        resolve(result?.secure_url);  // `secure_url` comes from UploadApiResponse
      });

      if (file.buffer) {
        // If the file is in memory (from Multer's memory storage), use the buffer
        uploadStream.end(file.buffer);
      } else {
        // Otherwise, use the file path (if file is saved on disk)
        cloudinary.uploader.upload(file.path, uploadOptions, (error, result: UploadApiResponse) => {
          if (error) {
            reject(`Error uploading to Cloudinary: ${error.message}`);
          }
          resolve(result?.secure_url);
        });
      }
    });
  }
}
