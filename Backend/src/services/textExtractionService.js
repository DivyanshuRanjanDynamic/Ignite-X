/**
 * Text Extraction Service
 * Extracts text from various file formats (PDF, DOCX, etc.)
 */

import logger from '../config/logger.js';

/**
 * Text Extraction Service
 * Handles extraction of text from different file formats
 */
export class TextExtractionService {
  constructor() {
    this.supportedFormats = ['pdf', 'docx', 'doc', 'txt'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
  }

  /**
   * Extract text from file buffer
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} mimeType - File MIME type
   * @param {string} filename - Original filename
   * @returns {Promise<string>} Extracted text
   */
  async extractText(fileBuffer, mimeType, filename) {
    try {
      // Validate file size
      if (fileBuffer.length > this.maxFileSize) {
        throw new Error(`File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`);
      }

      // Determine file type and extract accordingly
      const fileType = this.getFileType(mimeType, filename);
      
      switch (fileType) {
        case 'pdf':
          return await this.extractFromPDF(fileBuffer);
        
        case 'docx':
          return await this.extractFromDOCX(fileBuffer);
        
        case 'doc':
          return await this.extractFromDOC(fileBuffer);
        
        case 'txt':
          return await this.extractFromTXT(fileBuffer);
        
        default:
          throw new Error(`Unsupported file format: ${fileType}`);
      }
    } catch (error) {
      logger.error('Text extraction failed', {
        error: error.message,
        mimeType,
        filename,
        fileSize: fileBuffer.length
      });
      throw error;
    }
  }

  /**
   * Get file type from MIME type and filename
   * @param {string} mimeType - MIME type
   * @param {string} filename - Filename
   * @returns {string} File type
   */
  getFileType(mimeType, filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    // Check MIME type first
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('wordprocessingml')) return 'docx';
    if (mimeType.includes('msword')) return 'doc';
    if (mimeType.includes('text/plain')) return 'txt';
    
    // Fallback to file extension
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'docx': return 'docx';
      case 'doc': return 'doc';
      case 'txt': return 'txt';
      default: return extension;
    }
  }

  /**
   * Extract text from PDF using pdf-parse library
   * @param {Buffer} fileBuffer - PDF file buffer
   * @returns {Promise<string>} Extracted text
   */
  async extractFromPDF(fileBuffer) {
    try {
      // Import pdf-parse dynamically
      const pdfParse = (await import('pdf-parse')).default;
      
      // Extract text from PDF
      const data = await pdfParse(fileBuffer);
      
      // Return extracted text
      return data.text;
    } catch (error) {
      logger.error('PDF text extraction failed', { error: error.message });
      throw new Error('Failed to extract text from PDF: ' + error.message);
    }
  }

  /**
   * Extract text from DOCX file using mammoth library
   * @param {Buffer} fileBuffer - DOCX file buffer
   * @returns {Promise<string>} Extracted text
   */
  async extractFromDOCX(fileBuffer) {
    try {
      // Import mammoth dynamically
      const mammoth = (await import('mammoth')).default;
      
      // Extract text from DOCX
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      
      // Return extracted text
      return result.value;
    } catch (error) {
      logger.error('DOCX text extraction failed', { error: error.message });
      throw new Error('Failed to extract text from DOCX: ' + error.message);
    }
  }

  /**
   * Extract text from DOC file
   * @param {Buffer} fileBuffer - DOC file buffer
   * @returns {Promise<string>} Extracted text
   */
  async extractFromDOC(fileBuffer) {
    try {
      // For DOC files, we recommend converting to DOCX first
      // This is a temporary solution until a proper DOC extraction library is implemented
      logger.warn('DOC text extraction is limited. For better results, please convert to DOCX format.');
      
      // Basic text extraction attempt - will extract some readable text but formatting will be lost
      const text = fileBuffer.toString('utf-8').replace(/[^\x20-\x7E\r\n]/g, '');
      
      // If we got some meaningful text, return it
      if (text.length > 100) {
        return text;
      }
      
      // Otherwise return a helpful message
      return 'This DOC file could not be fully processed. For better results, please convert to PDF or DOCX format.';
    } catch (error) {
      logger.error('DOC text extraction failed', { error: error.message });
      throw new Error('Failed to extract text from DOC file. Please convert to PDF or DOCX format for better results.');
    }
  }

  /**
   * Extract text from TXT file
   * @param {Buffer} fileBuffer - TXT file buffer
   * @returns {Promise<string>} Extracted text
   */
  async extractFromTXT(fileBuffer) {
    try {
      // Simple text extraction
      return fileBuffer.toString('utf-8');
    } catch (error) {
      logger.error('TXT text extraction failed', { error: error.message });
      throw new Error('Failed to extract text from TXT');
    }
  }

  /**
   * Clean and normalize extracted text
   * @param {string} text - Raw extracted text
   * @returns {string} Cleaned text
   */
  cleanText(text) {
    if (!text) return '';
    
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove special characters but keep basic punctuation
      .replace(/[^\w\s.,!?;:()-]/g, '')
      // Trim whitespace
      .trim();
  }

  /**
   * Validate if file format is supported
   * @param {string} mimeType - MIME type
   * @param {string} filename - Filename
   * @returns {boolean} Is supported
   */
  isSupported(mimeType, filename) {
    const fileType = this.getFileType(mimeType, filename);
    return this.supportedFormats.includes(fileType);
  }

  /**
   * Get supported formats
   * @returns {Array} Supported formats
   */
  getSupportedFormats() {
    return [...this.supportedFormats];
  }
}

// Export singleton instance
export const textExtractionService = new TextExtractionService();
export default textExtractionService;
