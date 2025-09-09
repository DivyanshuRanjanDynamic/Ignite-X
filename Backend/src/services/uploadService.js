import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import logger from '../config/logger.js';

class UploadService {
  constructor() {
    // Configure Cloudinary
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    this.maxFileSize = {
      resume: 5 * 1024 * 1024, // 5MB for resumes
      profilePhoto: 2 * 1024 * 1024, // 2MB for profile photos
    };
    
    this.allowedMimeTypes = {
      resume: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      profilePhoto: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ],
    };
    
    logger.info('Cloudinary upload service initialized', {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  }

  /**
   * Upload file to Cloudinary
   * @param {Object} file - File object
   * @param {String} folder - Folder name in Cloudinary
   * @returns {Object} Cloudinary upload response
   */
  async uploadToCloudinary(file, folder) {
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            allowed_formats: folder === 'resumes' ? ['pdf', 'doc', 'docx'] : ['jpg', 'jpeg', 'png', 'webp'],
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            tags: [`${folder}`, 'pm-internship-platform'],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        
        uploadStream.end(file.buffer);
      });
      
      logger.info(`File uploaded to Cloudinary successfully`, {
        publicId: result.public_id,
        url: result.secure_url,
        folder,
      });
      
      return result;
    } catch (error) {
      logger.error('Failed to upload file to Cloudinary', {
        error: error.message,
        folder,
      });
      throw error;
    }
  }

  /**
   * Generate unique filename
   */
  generateFilename(originalName, type) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    return `${type}_${timestamp}_${randomString}${extension}`;
  }

  /**
   * Validate file type and size
   */
  validateFile(file, type) {
    const errors = [];

    // Check file type
    if (!this.allowedMimeTypes[type].includes(file.mimetype)) {
      errors.push({
        field: type,
        message: `Invalid file type. Allowed types: ${this.allowedMimeTypes[type].join(', ')}`,
      });
    }

    // Check file size
    if (file.size > this.maxFileSize[type]) {
      const maxSizeMB = this.maxFileSize[type] / (1024 * 1024);
      errors.push({
        field: type,
        message: `File size too large. Maximum size: ${maxSizeMB}MB`,
      });
    }

    return errors;
  }

  /**
   * Configure multer storage with Cloudinary
   */
  getMulterConfig() {
    // Use memory storage instead of disk storage
    const storage = multer.memoryStorage();

    const fileFilter = (req, file, cb) => {
      const fieldType = file.fieldname === 'resume' ? 'resume' : 'profilePhoto';
      const errors = this.validateFile(file, fieldType);
      
      if (errors.length > 0) {
        const error = new Error(errors[0].message);
        error.field = fieldType;
        return cb(error, false);
      }
      
      cb(null, true);
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: Math.max(this.maxFileSize.resume, this.maxFileSize.profilePhoto),
        files: 2, // resume + profile photo
      },
    });
  }

  /**
   * Upload middleware for student registration
   */
  getUploadMiddleware() {
    const upload = this.getMulterConfig();
    
    return upload.fields([
      { name: 'resume', maxCount: 1 },
      { name: 'profilePhoto', maxCount: 1 },
    ]);
  }

  /**
   * Handle file upload errors
   */
  handleUploadError(error, req, res, next) {
    logger.error('File upload error', {
      error: error.message,
      field: error.field,
      userId: req.user?.id,
    });

    if (error instanceof multer.MulterError) {
      let message = 'File upload error';
      
      switch (error.code) {
        case 'LIMIT_FILE_SIZE':
          message = 'File size too large';
          break;
        case 'LIMIT_FILE_COUNT':
          message = 'Too many files uploaded';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          message = 'Unexpected file field';
          break;
        default:
          message = error.message;
      }

      return res.status(400).json({
        success: false,
        error: {
          code: 'FILE_UPLOAD_ERROR',
          message,
          field: error.field,
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (error.field) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE',
          message: error.message,
          field: error.field,
        },
        timestamp: new Date().toISOString(),
      });
    }

    next(error);
  }

  /**
   * Process uploaded file
   * @param {Object} file - File object from multer
   * @param {String} type - File type ('resume' or 'profilePhoto')
   * @returns {Promise<Object>} File metadata including URL
   */
  async processUpload(file, type) {
    try {
      if (!file) return null;
      
      const folder = type === 'resume' ? 'resumes' : 'profile-photos';
      const result = await this.uploadToCloudinary(file, folder);
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        createdAt: new Date(),
      };
    } catch (error) {
      logger.error('Failed to process upload', {
        error: error.message,
        type,
      });
      throw error;
    }
  }

  /**
   * Delete file from Cloudinary
   * @param {String} publicId - Cloudinary public ID
   * @returns {Promise<Boolean>} Success status
   */
  async deleteFile(publicId) {
    try {
      if (!publicId) return false;
      
      const result = await cloudinary.v2.uploader.destroy(publicId);
      
      logger.info(`Deleted file from Cloudinary: ${publicId}`, {
        result,
      });
      
      return result.result === 'ok';
    } catch (error) {
      logger.error('Failed to delete file from Cloudinary', {
        publicId,
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Get Cloudinary resource info
   * @param {String} publicId - Cloudinary public ID
   * @returns {Promise<Object>} Resource info
   */
  async getResourceInfo(publicId) {
    try {
      if (!publicId) return null;
      
      const result = await cloudinary.v2.api.resource(publicId);
      return result;
    } catch (error) {
      logger.error('Failed to get Cloudinary resource info', {
        publicId,
        error: error.message,
      });
      return null;
    }
  }
  
  /**
   * Get resource usage statistics
   * @returns {Promise<Object>} Cloudinary usage statistics
   */
  async getUsageStats() {
    try {
      const result = await cloudinary.v2.api.usage();
      return result;
    } catch (error) {
      logger.error('Failed to get Cloudinary usage stats', {
        error: error.message,
      });
      return null;
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService();
export default uploadService;
