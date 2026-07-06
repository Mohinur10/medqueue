import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { logger } from '../utils/logger';

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
  logger.info('Cloudinary initialized');
}

export class UploadService {
  private static isConfigured() {
    return !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
  }

  static async uploadImage(buffer: Buffer, folder: string = 'medqueue'): Promise<string> {
    if (!this.isConfigured()) {
      logger.warn('Cloudinary is not configured. Returning dummy image URL.');
      return 'https://via.placeholder.com/150';
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        reject(new Error('Upload failed with no result'));
      }).end(buffer);
    });
  }

  static async uploadDocument(buffer: Buffer, folder: string = 'medqueue/docs'): Promise<string> {
    if (!this.isConfigured()) {
      logger.warn('Cloudinary is not configured. Returning dummy document URL.');
      return 'https://via.placeholder.com/500x700?text=Document';
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        reject(new Error('Upload failed with no result'));
      }).end(buffer);
    });
  }
}
