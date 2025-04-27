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

  async uploadImage(file: Express.Multer.File): Promise<string> { // ✅ Use Express.Multer.File
    const uploadOptions = {
      folder: 'service_image',
    };

    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result: UploadApiResponse) => {
        if (error) {
          reject(`Error uploading to Cloudinary: ${error.message}`);
        } else {
          resolve(result?.secure_url || '');
        }
      });

      if (file.buffer) {
        uploadStream.end(file.buffer);
      } else if (file.path) {
        cloudinary.uploader.upload(file.path, uploadOptions, (error, result: UploadApiResponse) => {
          if (error) {
            reject(`Error uploading to Cloudinary: ${error.message}`);
          } else {
            resolve(result?.secure_url || '');
          }
        });
      } else {
        reject('No file buffer or path found.');
      }
    });
  }
}
