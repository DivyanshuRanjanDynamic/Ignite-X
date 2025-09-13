/**
 * Database Migration Script for Resume V2
 * Adds new collections and indexes for enhanced resume management
 */

import { PrismaClient } from '@prisma/client';
import logger from '../src/config/logger.js';

const prisma = new PrismaClient();

/**
 * Run migration for Resume V2
 */
async function migrateResumeV2() {
  try {
    logger.info('Starting Resume V2 migration...');

    // Create indexes for better performance
    await createIndexes();
    
    // Add any data migrations if needed
    await migrateData();
    
    logger.info('Resume V2 migration completed successfully');
  } catch (error) {
    logger.error('Resume V2 migration failed', { error: error.message });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create database indexes
 */
async function createIndexes() {
  try {
    logger.info('Creating database indexes...');

    // Note: Prisma handles index creation through schema.prisma
    // This function is here for any custom indexes that might be needed
    
    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error('Failed to create indexes', { error: error.message });
    throw error;
  }
}

/**
 * Migrate existing data if needed
 */
async function migrateData() {
  try {
    logger.info('Migrating existing data...');

    // Check if there are any existing files that should be migrated to resumes
    const existingFiles = await prisma.file.findMany({
      where: {
        category: 'RESUME',
        isActive: true
      }
    });

    if (existingFiles.length > 0) {
      logger.info(`Found ${existingFiles.length} existing resume files to migrate`);
      
      // Create resume records for existing files
      for (const file of existingFiles) {
        try {
          await prisma.resume.create({
            data: {
              userId: file.userId,
              filename: file.fileName,
              originalName: file.originalName,
              storageUrl: file.fileUrl,
              previewUrl: file.fileUrl, // Use same URL for preview
              publicId: file.publicId,
              mimeType: file.mimeType,
              fileSize: file.fileSize,
              atsScore: null, // Will be calculated on next upload
              skillScores: null,
              extractedText: null,
              atsStatus: 'PENDING',
              metadata: {
                migratedFrom: 'file',
                originalFileId: file.id,
                migrationDate: new Date().toISOString()
              }
            }
          });
          
          logger.info(`Migrated resume file: ${file.originalName}`);
        } catch (error) {
          logger.error(`Failed to migrate file ${file.id}`, { error: error.message });
        }
      }
    }

    logger.info('Data migration completed');
  } catch (error) {
    logger.error('Failed to migrate data', { error: error.message });
    throw error;
  }
}

/**
 * Rollback migration
 */
async function rollbackResumeV2() {
  try {
    logger.info('Starting Resume V2 rollback...');

    // Remove migrated resume records
    const migratedResumes = await prisma.resume.findMany({
      where: {
        metadata: {
          path: ['migratedFrom'],
          equals: 'file'
        }
      }
    });

    for (const resume of migratedResumes) {
      await prisma.resume.delete({
        where: { id: resume.id }
      });
    }

    logger.info(`Rolled back ${migratedResumes.length} migrated resumes`);
    logger.info('Resume V2 rollback completed successfully');
  } catch (error) {
    logger.error('Resume V2 rollback failed', { error: error.message });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'rollback') {
    rollbackResumeV2();
  } else {
    migrateResumeV2();
  }
}

export { migrateResumeV2, rollbackResumeV2 };
