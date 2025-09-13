import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import logger from '../config/logger.js';

class UploadService {
  constructor() {
    // Configure Cloudinary with fallback values
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo_cloud',
      api_key: process.env.CLOUDINARY_API_KEY || 'demo_key',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'demo_secret',
    });
    
    this.maxFileSize = {
      resume: 5 * 1024 * 1024, // 5MB for resumes
      profilePhoto: 2 * 1024 * 1024, // 2MB for profile photos
      certificate: 5 * 1024 * 1024, // 5MB for certificates
      achievement: 5 * 1024 * 1024, // 5MB for achievements
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
      certificate: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ],
      achievement: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
            allowed_formats: this.getAllowedFormats(folder),
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
   * Get allowed formats for Cloudinary upload based on folder
   * @param {String} folder - Folder name
   * @returns {Array} Allowed formats
   */
  getAllowedFormats(folder) {
    switch (folder) {
      case 'resumes':
        return ['pdf', 'doc', 'docx'];
      case 'certificates':
        return ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'];
      case 'achievements':
        return ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'];
      case 'profile-photos':
        return ['jpg', 'jpeg', 'png', 'webp'];
      default:
        return ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'];
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

    // Check if type is supported
    if (!this.allowedMimeTypes[type]) {
      errors.push({
        field: type,
        message: `Unsupported file type: ${type}`,
      });
      return errors;
    }

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
      // Map field names to types
      const fieldTypeMap = {
        'resume': 'resume',
        'profilePhoto': 'profilePhoto',
        'certificate': 'certificate',
        'achievement': 'achievement',
        'certificates': 'certificate',
        'achievements': 'achievement'
      };
      
      const fieldType = fieldTypeMap[file.fieldname] || 'resume';
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
        fileSize: Math.max(
          this.maxFileSize.resume, 
          this.maxFileSize.profilePhoto,
          this.maxFileSize.certificate,
          this.maxFileSize.achievement
        ),
        files: 10, // Allow multiple files for certificates and achievements
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
      { name: 'certificates', maxCount: 5 }, // Allow up to 5 certificates
      { name: 'achievements', maxCount: 5 }, // Allow up to 5 achievements
    ]);
  }

  /**
   * Upload middleware for single file upload
   */
  getSingleUploadMiddleware() {
    const upload = this.getMulterConfig();
    
    return upload.single('file');
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
   * @param {String} type - File type ('resume', 'profilePhoto', 'certificate', 'achievement')
   * @returns {Promise<Object>} File metadata including URL
   */
  async processUpload(file, type) {
    try {
      if (!file) return null;
      
      // Check if Cloudinary is properly configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'demo_cloud') {
        logger.warn('Cloudinary not configured, using mock upload for development');
        return {
          url: `https://demo-cloudinary.com/mock-${type}-${Date.now()}.pdf`,
          publicId: `mock-${type}-${Date.now()}`,
          format: 'pdf',
          size: file.size,
          createdAt: new Date(),
        };
      }
      
      const folderMap = {
        'resume': 'resumes',
        'profilePhoto': 'profile-photos',
        'certificate': 'certificates',
        'achievement': 'achievements'
      };
      
      const folder = folderMap[type] || 'documents';
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
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Process multiple uploaded files
   * @param {Array} files - Array of file objects from multer
   * @param {String} type - File type ('certificate', 'achievement')
   * @returns {Promise<Array>} Array of file metadata including URLs
   */
  async processMultipleUploads(files, type) {
    try {
      if (!files || files.length === 0) return [];
      
      const uploadPromises = files.map(file => this.processUpload(file, type));
      const results = await Promise.all(uploadPromises);
      
      return results.filter(result => result !== null);
    } catch (error) {
      logger.error('Failed to process multiple uploads', {
        error: error.message,
        type,
        fileCount: files?.length || 0,
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
