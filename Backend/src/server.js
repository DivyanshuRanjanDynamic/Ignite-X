import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';

// Import configurations
import config from './config/env.js';
import logger from './config/logger.js';
import database from './config/database.js';

// Import routes
import apiRoutes from './routes/index.js';

// Import middleware (we'll create these next)
// import rateLimiter from './middleware/rateLimiter.js';
// import errorHandler from './middleware/errorHandler.js';

const app = express();

// ============================================
// 🚀 STARTUP FUNCTION
// ============================================
async function startServer() {
  try {
    logger.info('🚀 Starting PM Internship Platform Server...');

    // ============================================
    // 📊 TRUST PROXY (for accurate IP addresses)
    // ============================================
    app.set('trust proxy', 1);

    // ============================================
    // 🛡️ SECURITY MIDDLEWARE
    // ============================================
    
    // Helmet for security headers
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: ["'self'", "https://api.github.com", "https://accounts.google.com"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    const corsOptions = {
      origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (config.security.corsOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          logger.warn('CORS Policy Violation', { origin, allowedOrigins: config.security.corsOrigins });
          callback(new Error('Not allowed by CORS policy'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-Key',
      ],
      exposedHeaders: [
        'X-Total-Count',
        'X-Page-Count',
        'X-Rate-Limit-Remaining',
        'X-Rate-Limit-Reset',
      ],
    };

    app.use(cors(corsOptions));

    // ============================================
    // 🔧 GENERAL MIDDLEWARE
    // ============================================
    
    // Compression
    app.use(compression());

    // Body parsing middleware
    app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf) => {
        req.rawBody = buf;
      }
    }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Morgan HTTP request logging
    if (config.app.isDevelopment) {
      app.use(morgan('combined', {
        stream: {
          write: (message) => logger.http(message.trim())
        }
      }));
    }

    // ============================================
    // 🗄️ DATABASE CONNECTION
    // ============================================
    
    logger.info('🔗 Connecting to database...');
    await database.connect();

    // ============================================
    // 🧪 HEALTH CHECK ENDPOINT
    // ============================================
    
    app.get('/health', async (req, res) => {
      try {
        const dbHealth = await database.healthCheck();
        
        const healthStatus = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          environment: config.app.env,
          version: process.env.npm_package_version || '1.0.0',
          database: dbHealth,
        };

        res.status(200).json({
          success: true,
          data: healthStatus,
        });
      } catch (error) {
        logger.error('Health check failed', { error: error.message });
        res.status(503).json({
          success: false,
          error: {
            code: 'HEALTH_CHECK_FAILED',
            message: 'Service unhealthy',
            details: error.message,
          },
        });
      }
    });

    // ============================================
    // 🎯 API ROUTES
    // ============================================
    
    app.get('/', (req, res) => {
      res.json({
        success: true,
        message: '🚀 PM Internship Platform API is running!',
        version: '1.0.0',
        environment: config.app.env,
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/health',
          api: `/api/${config.app.apiVersion}`,
        },
      });
    });

    // API base route
    app.get(`/api/${config.app.apiVersion}`, (req, res) => {
      res.json({
        success: true,
        message: 'PM Internship Platform API v1',
        timestamp: new Date().toISOString(),
        availableEndpoints: {
          auth: `/api/${config.app.apiVersion}/auth`,
          users: `/api/${config.app.apiVersion}/users`,
          internships: `/api/${config.app.apiVersion}/internships`,
          applications: `/api/${config.app.apiVersion}/applications`,
        },
      });
    });

    // API routes
    app.use(`/api/${config.app.apiVersion}`, apiRoutes);

    // ============================================
    // ❌ ERROR HANDLING
    // ============================================
    
    // 404 handler for undefined routes
    app.use('*', (req, res) => {
      logger.warn('Route not found', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
      });

      res.status(404).json({
        success: false,
        error: {
          code: 'ROUTE_NOT_FOUND',
          message: `Route ${req.method} ${req.originalUrl} not found`,
        },
        timestamp: new Date().toISOString(),
      });
    });

    // Global error handler (basic for now)
    app.use((error, req, res, next) => {
      logger.error('Unhandled application error', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        request: {
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body,
        },
      });

      res.status(error.statusCode || 500).json({
        success: false,
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: config.app.isDevelopment ? error.message : 'Something went wrong',
          ...(config.app.isDevelopment && { stack: error.stack }),
        },
        timestamp: new Date().toISOString(),
      });
    });

    // ============================================
    // 🚀 START SERVER
    // ============================================
    
    const server = app.listen(config.app.port, () => {
      logger.info(`🚀 Server running successfully!`, {
        port: config.app.port,
        environment: config.app.env,
        processId: process.pid,
        nodeVersion: process.version,
      });

      logger.info('🔗 Available endpoints:', {
        health: `http://localhost:${config.app.port}/health`,
        api: `http://localhost:${config.app.port}/api/${config.app.apiVersion}`,
        root: `http://localhost:${config.app.port}/`,
      });

      console.log(`\\n🎉 PM Internship Platform API is live!`);
      console.log(`📍 Server: http://localhost:${config.app.port}`);
      console.log(`🏥 Health: http://localhost:${config.app.port}/health`);
      console.log(`🔌 API: http://localhost:${config.app.port}/api/${config.app.apiVersion}`);
      console.log(`\\n📝 Ready to accept requests...\\n`);
    });

    // ============================================
    // 🛑 GRACEFUL SHUTDOWN
    // ============================================
    
    const gracefulShutdown = async (signal) => {
      logger.info(`🛑 ${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('🔌 HTTP server closed');
        
        try {
          await database.gracefulShutdown();
          logger.info('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('❌ Error during graceful shutdown', { error: error.message });
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('⏰ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
