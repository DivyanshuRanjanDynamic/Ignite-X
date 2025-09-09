import { PrismaClient } from '@prisma/client';
import logger from './logger.js';

class Database {
  constructor() {
    this.prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
      errorFormat: 'pretty',
    });

    // Database event logging
    this.prisma.$on('query', (e) => {
      logger.debug('Database Query', {
        query: e.query,
        params: e.params,
        duration: `${e.duration}ms`,
        target: e.target,
      });
    });

    this.prisma.$on('error', (e) => {
      logger.error('Database Error', {
        target: e.target,
        message: e.message,
      });
    });

    this.prisma.$on('info', (e) => {
      logger.info('Database Info', {
        target: e.target,
        message: e.message,
      });
    });

    this.prisma.$on('warn', (e) => {
      logger.warn('Database Warning', {
        target: e.target,
        message: e.message,
      });
    });
  }

  async connect() {
    try {
      await this.prisma.$connect();
      logger.info('🗄️ Database connected successfully');
      
      // Skip connection test in development to avoid startup failures
      if (process.env.NODE_ENV === 'development') {
        logger.info('⚠️ Skipping database test in development mode');
        return true;
      }
      
      // Test the connection with MongoDB compatible query
      await this.prisma.user.findMany({ take: 1 });
      logger.info('✅ Database connection test passed');
      
      return true;
    } catch (error) {
      logger.error('❌ Database connection failed', {
        error: error.message,
        stack: error.stack,
      });
      
      // In development, log error but don't fail startup
      if (process.env.NODE_ENV === 'development') {
        logger.warn('🚧 Database connection failed, but continuing in development mode');
        return false;
      }
      
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.prisma.$disconnect();
      logger.info('🔌 Database disconnected successfully');
    } catch (error) {
      logger.error('❌ Database disconnection failed', {
        error: error.message,
      });
      throw error;
    }
  }

  async healthCheck() {
    try {
      const startTime = Date.now();
      await this.prisma.user.findMany({ take: 1 });
      const duration = Date.now() - startTime;
      
      return {
        status: 'healthy',
        connection: 'active',
        responseTime: `${duration}ms`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        connection: 'failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Graceful shutdown handler
  async gracefulShutdown() {
    logger.info('🛑 Initiating graceful database shutdown...');
    
    try {
      await this.disconnect();
      logger.info('✅ Database shutdown completed');
    } catch (error) {
      logger.error('❌ Error during database shutdown', {
        error: error.message,
      });
      throw error;
    }
  }
}

// Create singleton instance
const database = new Database();

// Handle process termination
process.on('SIGINT', async () => {
  await database.gracefulShutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await database.gracefulShutdown();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  logger.error('Unhandled Rejection at Promise', {
    promise,
    reason: reason?.message || reason,
  });
  await database.gracefulShutdown();
  process.exit(1);
});

export default database;
