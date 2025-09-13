/**
 * Storage Adapter Interface
 * Provides a pluggable interface for file storage (Cloudinary, S3, etc.)
 */

import cloudinary from 'cloudinary';
import logger from '../config/logger.js';

/**
 * Storage Adapter Interface
 * All storage implementations must implement these methods
 */
export class IStorageAdapter {
  /**
   * Upload a file to storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} filename - Original filename
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result with URL and metadata
   */
  async upload(fileBuffer, filename, options = {}) {
    throw new Error('upload() method must be implemented by storage adapter');
  }

  /**
   * Delete a file from storage
   * @param {string} publicId - File public ID or key
   * @returns {Promise<boolean>} Success status
   */
  async delete(publicId) {
    throw new Error('delete() method must be implemented by storage adapter');
  }

  /**
   * Generate a preview URL for a file
   * @param {string} publicId - File public ID
   * @param {Object} options - Preview options
   * @returns {string} Preview URL
   */
  generatePreviewUrl(publicId, options = {}) {
    throw new Error('generatePreviewUrl() method must be implemented by storage adapter');
  }

  /**
   * Get file metadata
   * @param {string} publicId - File public ID
   * @returns {Promise<Object>} File metadata
   */
  async getMetadata(publicId) {
    throw new Error('getMetadata() method must be implemented by storage adapter');
  }
}

/**
 * Cloudinary Storage Adapter
 * Implements storage interface using Cloudinary
 */
export class CloudinaryStorageAdapter extends IStorageAdapter {
  constructor(config) {
    super();
    this.config = config;
    
    // Configure Cloudinary
    cloudinary.v2.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
    
    logger.info('Cloudinary storage adapter initialized', {
      cloudName: config.cloudName
    });
  }

  /**
   * Upload file to Cloudinary
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} filename - Original filename
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async upload(fileBuffer, filename, options = {}) {
    try {
      const {
        folder = 'resumes',
        resourceType = 'auto',
        allowedFormats = ['pdf', 'doc', 'docx'],
        tags = ['resume-v2']
      } = options;

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
            allowed_formats: allowedFormats,
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            tags: [...tags, 'pm-internship-platform'],
            transformation: this.getTransformationOptions(options)
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        
        uploadStream.end(fileBuffer);
      });
      
      logger.info('File uploaded to Cloudinary successfully', {
        publicId: result.public_id,
        url: result.secure_url,
        folder,
        size: result.bytes
      });
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        createdAt: new Date(),
        metadata: {
          originalFilename: filename,
          folder,
          tags
        }
      };
    } catch (error) {
      logger.error('Failed to upload file to Cloudinary', {
        error: error.message,
        filename,
        folder: options.folder
      });
      throw error;
    }
  }

  /**
   * Delete file from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(publicId) {
    try {
      if (!publicId) return false;
      
      const result = await cloudinary.v2.uploader.destroy(publicId);
      
      logger.info(`Deleted file from Cloudinary: ${publicId}`, {
        result: result.result
      });
      
      return result.result === 'ok';
    } catch (error) {
      logger.error('Failed to delete file from Cloudinary', {
        publicId,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Generate preview URL for file
   * @param {string} publicId - Cloudinary public ID
   * @param {Object} options - Preview options
   * @returns {string} Preview URL
   */
  generatePreviewUrl(publicId, options = {}) {
    try {
      const {
        width = 800,
        height = 1000,
        quality = 'auto',
        format = 'auto'
      } = options;

      const transformation = {
        width,
        height,
        quality,
        format,
        crop: 'fit',
        flags: 'attachment'
      };

      return cloudinary.v2.url(publicId, {
        transformation: [transformation],
        secure: true
      });
    } catch (error) {
      logger.error('Failed to generate preview URL', {
        publicId,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Get file metadata from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<Object>} File metadata
   */
  async getMetadata(publicId) {
    try {
      if (!publicId) return null;
      
      const result = await cloudinary.v2.api.resource(publicId);
      
      return {
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        url: result.secure_url,
        createdAt: result.created_at,
        tags: result.tags || []
      };
    } catch (error) {
      logger.error('Failed to get file metadata from Cloudinary', {
        publicId,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Get transformation options based on file type and requirements
   * @param {Object} options - Upload options
   * @returns {Object} Transformation options
   */
  getTransformationOptions(options) {
    const { fileType, generatePreview = true } = options;
    
    if (!generatePreview) return {};
    
    // For PDFs, we'll generate a preview image
    if (fileType === 'pdf') {
      return {
        pages: 1, // First page only for preview
        format: 'jpg',
        quality: 'auto'
      };
    }
    
    // For images, optimize for web
    if (['jpg', 'jpeg', 'png', 'webp'].includes(fileType)) {
      return {
        quality: 'auto',
        format: 'auto'
      };
    }
    
    return {};
  }

  /**
   * Generate ATS-optimized template URL
   * @param {string} publicId - Original file public ID
   * @returns {string} ATS-optimized template URL
   */
  generateATSTemplateUrl(publicId) {
    try {
      // Apply ATS-friendly transformations to make the resume more parseable by ATS systems
      return cloudinary.v2.url(publicId, {
        secure: true,
        transformation: [
          // Optimize for ATS readability
          {
            quality: 'auto',
            format: 'pdf',
            flags: 'attachment:ats_optimized_template',
            effect: 'improve',
            dpr: 'auto'
          },
          // Ensure text is clear and readable
          {
            color: 'black',
            background: 'white',
            border: '0px_solid_white'
          },
          // Optimize for standard resume format
          {
            page_format: 'letter',
            density: 300
          }
        ],
        // Add ATS-friendly metadata
        resource_type: 'raw',
        type: 'upload',
        sign_url: true
      });
    } catch (error) {
      logger.error('Failed to generate ATS template URL', {
        publicId,
        error: error.message
      });
      return null;
    }
  }
}

/**
 * S3 Storage Adapter (for future use)
 * Implements storage interface using AWS S3
 */
export class S3StorageAdapter extends IStorageAdapter {
  constructor(config) {
    super();
    this.config = config;
    // Initialize AWS S3 client here
    logger.info('S3 storage adapter initialized', {
      bucket: config.bucket
    });
  }

  async upload(fileBuffer, filename, options = {}) {
    // Implement S3 upload logic
    throw new Error('S3 adapter not implemented yet');
  }

  async delete(publicId) {
    // Implement S3 delete logic
    throw new Error('S3 adapter not implemented yet');
  }

  generatePreviewUrl(publicId, options = {}) {
    // Implement S3 preview URL generation
    throw new Error('S3 adapter not implemented yet');
  }

  async getMetadata(publicId) {
    // Implement S3 metadata retrieval
    throw new Error('S3 adapter not implemented yet');
  }
}

/**
 * Storage Adapter Factory
 * Creates appropriate storage adapter based on configuration
 */
export class StorageAdapterFactory {
  static create(config) {
    const { type } = config;
    
    switch (type) {
      case 'cloudinary':
        return new CloudinaryStorageAdapter(config);
      
      case 's3':
        return new S3StorageAdapter(config);
      
      default:
        throw new Error(`Unsupported storage type: ${type}`);
    }
  }
}

export default StorageAdapterFactory;
