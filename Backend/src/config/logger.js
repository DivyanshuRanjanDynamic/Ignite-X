import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(logColors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    
    let metaString = '';
    if (Object.keys(meta).length > 0) {
      metaString = `\\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return `${timestamp} [${level}]: ${message}${metaString}`;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Create transports array
const transports = [];

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: consoleFormat,
  })
);

// File transports (only in non-test environment)
if (process.env.NODE_ENV !== 'test') {
  // Error logs - separate file for errors only
  transports.push(
    new DailyRotateFile({
      filename: join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: fileFormat,
      maxSize: '10m',
      maxFiles: '14d', // Keep logs for 14 days
      zippedArchive: true,
    })
  );

  // Combined logs - all log levels
  transports.push(
    new DailyRotateFile({
      filename: join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      format: fileFormat,
      maxSize: '10m',
      maxFiles: '7d', // Keep logs for 7 days
      zippedArchive: true,
    })
  );

  // HTTP access logs
  transports.push(
    new DailyRotateFile({
      filename: join(logsDir, 'access-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'http',
      format: fileFormat,
      maxSize: '10m',
      maxFiles: '7d',
      zippedArchive: true,
    })
  );
}

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  defaultMeta: {
    service: 'pm-internship-api',
    environment: process.env.NODE_ENV || 'development',
  },
  transports,
  exitOnError: false, // Don't exit on unhandled exceptions
});

// Handle logging errors
logger.on('error', (error) => {
  console.error('Logger error:', error);
});

// Add request ID to logs when available
logger.addRequestId = (requestId) => {
  return logger.child({ requestId });
};

// Helper methods for structured logging
logger.logAPIRequest = (req, res, responseTime) => {
  logger.http('API Request', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
    requestId: req.requestId,
  });
};

logger.logAPIError = (error, req) => {
  logger.error('API Error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    request: {
      method: req?.method,
      url: req?.url,
      headers: req?.headers,
      body: req?.body,
      params: req?.params,
      query: req?.query,
      userId: req?.user?.id,
      requestId: req?.requestId,
    },
  });
};

logger.logSecurityEvent = (eventType, details, req) => {
  logger.warn('Security Event', {
    eventType,
    details,
    request: {
      ip: req?.ip,
      userAgent: req?.get('User-Agent'),
      url: req?.url,
      method: req?.method,
      userId: req?.user?.id,
      requestId: req?.requestId,
    },
    timestamp: new Date().toISOString(),
  });
};

logger.logDatabaseOperation = (operation, table, duration, success = true) => {
  const level = success ? 'debug' : 'error';
  logger.log(level, 'Database Operation', {
    operation,
    table,
    duration: `${duration}ms`,
    success,
    timestamp: new Date().toISOString(),
  });
};

logger.logEmailSent = (to, subject, success = true, error = null) => {
  const level = success ? 'info' : 'error';
  logger.log(level, 'Email Notification', {
    to,
    subject,
    success,
    error: error?.message,
    timestamp: new Date().toISOString(),
  });
};

logger.logFileUpload = (filename, fileSize, userId, success = true) => {
  const level = success ? 'info' : 'error';
  logger.log(level, 'File Upload', {
    filename,
    fileSize,
    userId,
    success,
    timestamp: new Date().toISOString(),
  });
};

// Log startup information
if (process.env.NODE_ENV !== 'test') {
  logger.info('🚀 Logger initialized', {
    logLevel: logger.level,
    environment: process.env.NODE_ENV,
    logsDirectory: logsDir,
  });
}

// Handle uncaught exceptions and unhandled rejections
if (process.env.NODE_ENV !== 'test') {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
    
    // Allow the logger to write the log before exiting
    setTimeout(() => {
      process.exit(1);
    }, 100);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason?.message || reason,
      promise: promise.toString(),
    });
  });
}

export default logger;
