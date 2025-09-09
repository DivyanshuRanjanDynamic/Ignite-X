# 🛡️ PM Internship Platform - Security & Middleware

## 🔒 **Security Overview**

This document outlines the comprehensive security implementation for the PM Internship Platform, including middleware, rate limiting, CORS configuration, input validation, and security best practices.

## 🏗️ **Security Architecture**

### **Security Layers**
1. **Network Security** - HTTPS, CORS, Rate Limiting
2. **Authentication Security** - JWT, OAuth, Session Management  
3. **Authorization Security** - Role-based permissions, Resource protection
4. **Input Security** - Validation, Sanitization, XSS Protection
5. **Data Security** - Encryption, Hashing, Secure Storage
6. **Monitoring Security** - Logging, Alerts, Intrusion Detection

## 🚦 **Middleware Stack**

### **Core Middleware Order**
```javascript
// Middleware execution order is critical for security
app.use(helmet()); // Security headers
app.use(cors(corsConfig)); // CORS configuration
app.use(compression()); // Response compression
app.use(express.json({ limit: '10mb' })); // JSON parsing with limits
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL encoding
app.use(rateLimiter); // Rate limiting
app.use(requestLogger); // Request logging
app.use(validateHeaders); // Header validation
app.use(csrfProtection); // CSRF protection
app.use('/api/v1', apiRoutes); // API routes
app.use(errorHandler); // Error handling
app.use(notFoundHandler); // 404 handler
```

## 🛡️ **Security Headers (Helmet)**

### **Helmet Configuration**
```javascript
const helmetConfig = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.github.com", "https://accounts.google.com"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // X-Frame-Options
  frameguard: {
    action: 'deny'
  },
  
  // X-Content-Type-Options
  noSniff: true,
  
  // X-XSS-Protection
  xssFilter: true,
  
  // Referrer-Policy
  referrerPolicy: {
    policy: ['no-referrer', 'strict-origin-when-cross-origin']
  },
  
  // Feature-Policy / Permissions-Policy
  permittedCrossDomainPolicies: false,
  
  // Hide X-Powered-By
  hidePoweredBy: true
};

app.use(helmet(helmetConfig));
```

## 🌐 **CORS Configuration**

### **Production CORS Setup**
```javascript
const corsConfig = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://pminternship.gov.in',
      'https://www.pminternship.gov.in',
      'https://admin.pminternship.gov.in'
    ];
    
    // Development origins
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push(
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://127.0.0.1:3000'
      );
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'X-Forwarded-For',
    'X-Real-IP'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Rate-Limit-Remaining',
    'X-Rate-Limit-Reset'
  ],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsConfig));
```

## ⚡ **Rate Limiting**

### **Advanced Rate Limiting Strategy**
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

// Redis connection for distributed rate limiting
const redis = new Redis(process.env.REDIS_URL);

// Rate limit configurations
const rateLimitConfigs = {
  // General API endpoints
  general: rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rl:general:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window per IP
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later'
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting for whitelisted IPs
    skip: (req) => {
      const whitelist = process.env.RATE_LIMIT_WHITELIST?.split(',') || [];
      return whitelist.includes(req.ip);
    }
  }),

  // Authentication endpoints (stricter)
  auth: rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rl:auth:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    message: {
      success: false,
      error: {
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts'
      }
    }
  }),

  // File upload endpoints
  upload: rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rl:upload:'
    }),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 uploads per hour
    message: {
      success: false,
      error: {
        code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
        message: 'Upload limit exceeded'
      }
    }
  }),

  // Password reset (very strict)
  passwordReset: rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rl:reset:'
    }),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: {
      success: false,
      error: {
        code: 'RESET_RATE_LIMIT_EXCEEDED',
        message: 'Password reset limit exceeded'
      }
    }
  })
};

// Apply rate limiting middleware
app.use('/api/v1', rateLimitConfigs.general);
app.use('/api/v1/auth', rateLimitConfigs.auth);
app.use('/api/v1/upload', rateLimitConfigs.upload);
app.use('/api/v1/auth/forgot-password', rateLimitConfigs.passwordReset);
app.use('/api/v1/auth/reset-password', rateLimitConfigs.passwordReset);
```

## 🔍 **Input Validation & Sanitization**

### **Joi Validation Schemas**
```javascript
const Joi = require('joi');

// User registration validation
const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.pattern.base': 'First name can only contain letters and spaces'
    }),
  lastName: Joi.string().trim().min(2).max(50).required()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.pattern.base': 'Last name can only contain letters and spaces'
    }),
  email: Joi.string().email().lowercase().required()
    .max(255)
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  password: Joi.string().min(8).max(128).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      'string.pattern.base': 'Password must contain at least 8 characters with uppercase, lowercase, number and special character'
    }),
  phone: Joi.string()
    .pattern(/^\+91[6-9]\d{9}$/)
    .messages({
      'string.pattern.base': 'Please provide a valid Indian phone number'
    }),
  role: Joi.string().valid('STUDENT', 'ADMIN', 'RECRUITER').default('STUDENT'),
  terms: Joi.boolean().valid(true).required()
    .messages({
      'any.only': 'You must accept the terms and conditions'
    })
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  remember: Joi.boolean().default(false)
});

// Internship creation validation
const internshipSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required(),
  description: Joi.string().trim().min(50).max(5000).required(),
  companyName: Joi.string().trim().min(2).max(100).required(),
  location: Joi.string().trim().min(2).max(100).required(),
  mode: Joi.string().valid('REMOTE', 'ONSITE', 'HYBRID').required(),
  duration: Joi.number().integer().min(1).max(12).required(),
  startDate: Joi.date().greater('now').required(),
  applicationDeadline: Joi.date().greater('now').less(Joi.ref('startDate')).required(),
  stipend: Joi.number().min(0).max(100000).allow(null),
  requirements: Joi.array().items(Joi.string().trim().min(1).max(100)).min(1).max(20),
  responsibilities: Joi.array().items(Joi.string().trim().min(1).max(200)).min(1).max(20),
  totalPositions: Joi.number().integer().min(1).max(100).default(1),
  category: Joi.string().trim().min(2).max(50).required(),
  tags: Joi.array().items(Joi.string().trim().min(1).max(30)).max(10)
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details: errors
        }
      });
    }

    req.body = value; // Use validated and sanitized data
    next();
  };
};
```

### **XSS Protection Middleware**
```javascript
const xss = require('xss');
const he = require('he');

// XSS sanitization middleware
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

const sanitizeObject = (obj) => {
  if (typeof obj === 'string') {
    // HTML encode to prevent XSS
    return he.encode(xss(obj));
  } else if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  } else if (typeof obj === 'object' && obj !== null) {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
};

app.use(sanitizeInput);
```

## 📝 **Request Logging & Monitoring**

### **Advanced Request Logger**
```javascript
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'pm-internship-api' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 10
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  const requestId = uuidv4();
  req.requestId = requestId;
  
  const startTime = Date.now();
  
  // Log request
  logger.info('Incoming Request', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    logger.info('Outgoing Response', {
      requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length'),
      timestamp: new Date().toISOString()
    });
    
    originalSend.call(this, data);
  };

  next();
};

app.use(requestLogger);
```

## 🚨 **Error Handling**

### **Centralized Error Handler**
```javascript
// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error occurred', {
    requestId: req.requestId,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      user: req.user?.id
    }
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404, 'RESOURCE_NOT_FOUND');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, 409, 'DUPLICATE_FIELD');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    const message = errors.join('. ');
    error = new AppError(message, 422, 'VALIDATION_ERROR');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401, 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401, 'TOKEN_EXPIRED');
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'Something went wrong',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      requestId: req.requestId
    },
    timestamp: new Date().toISOString()
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection', { error: err });
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err });
  process.exit(1);
});

app.use(errorHandler);
```

## 🔐 **File Upload Security**

### **Secure File Upload Middleware**
```javascript
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// File upload configuration
const fileUploadConfig = {
  storage: multer.memoryStorage(), // Store in memory for processing
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files
    fields: 10 // Maximum 10 fields
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    };

    // Check MIME type
    if (!allowedTypes[file.mimetype]) {
      return cb(new AppError('File type not allowed', 400, 'INVALID_FILE_TYPE'));
    }

    // Check file extension
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes[file.mimetype].includes(fileExt)) {
      return cb(new AppError('File extension does not match MIME type', 400, 'INVALID_FILE_EXTENSION'));
    }

    // Generate secure filename
    const randomName = crypto.randomBytes(16).toString('hex');
    file.filename = `${randomName}${fileExt}`;

    cb(null, true);
  }
};

// File upload middleware
const uploadMiddleware = multer(fileUploadConfig);

// File validation middleware
const validateFileContent = async (req, res, next) => {
  if (!req.files && !req.file) {
    return next();
  }

  const files = req.files ? Object.values(req.files).flat() : [req.file];

  try {
    for (const file of files) {
      // Validate file signature (magic numbers)
      const fileSignature = file.buffer.slice(0, 4);
      if (!isValidFileSignature(fileSignature, file.mimetype)) {
        throw new AppError('File content does not match declared type', 400, 'INVALID_FILE_CONTENT');
      }

      // Scan for malicious content (basic implementation)
      if (await containsMaliciousContent(file.buffer)) {
        throw new AppError('File contains suspicious content', 400, 'SUSPICIOUS_FILE_CONTENT');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

// File signature validation
const isValidFileSignature = (signature, mimetype) => {
  const signatures = {
    'image/jpeg': [[0xFF, 0xD8, 0xFF]],
    'image/png': [[0x89, 0x50, 0x4E, 0x47]],
    'application/pdf': [[0x25, 0x50, 0x44, 0x46]]
  };

  const validSignatures = signatures[mimetype];
  if (!validSignatures) return true; // Allow if no signature check defined

  return validSignatures.some(validSig => 
    validSig.every((byte, index) => signature[index] === byte)
  );
};

// Basic malicious content detection
const containsMaliciousContent = async (buffer) => {
  const content = buffer.toString('utf8').toLowerCase();
  const maliciousPatterns = [
    '<script',
    'javascript:',
    'vbscript:',
    'onload=',
    'onerror=',
    'eval(',
    'document.cookie'
  ];

  return maliciousPatterns.some(pattern => content.includes(pattern));
};
```

## 🔒 **Environment Security**

### **Environment Variables Validation**
```javascript
const Joi = require('joi');

// Environment variables schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  DATABASE_URL: Joi.string().required(),
  
  // JWT Secrets
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EMAIL_SECRET: Joi.string().min(32).required(),
  JWT_RESET_SECRET: Joi.string().min(32).required(),
  
  // OAuth
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GITHUB_CLIENT_ID: Joi.string().required(),
  GITHUB_CLIENT_SECRET: Joi.string().required(),
  
  // Email
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  
  // Security
  BCRYPT_SALT_ROUNDS: Joi.number().default(12),
  RATE_LIMIT_WHITELIST: Joi.string().default(''),
  
  // External Services
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  
  // Frontend URLs
  FRONTEND_URL: Joi.string().uri().required(),
  FRONTEND_LOGIN_URL: Joi.string().uri().required()
}).unknown();

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = envVars;
```

## 🎯 **Security Monitoring & Alerts**

### **Security Event Detection**
```javascript
// Security monitoring middleware
const securityMonitor = (req, res, next) => {
  // Track suspicious patterns
  const suspiciousPatterns = [
    /\.\./g, // Directory traversal
    /<script/gi, // XSS attempts
    /union.*select/gi, // SQL injection
    /javascript:/gi, // JavaScript injection
    /eval\(/gi, // Code injection
    /document\.cookie/gi // Cookie theft attempts
  ];

  const checkSuspicious = (data) => {
    if (typeof data === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(data));
    }
    if (typeof data === 'object' && data !== null) {
      return Object.values(data).some(value => checkSuspicious(value));
    }
    return false;
  };

  // Check request for suspicious content
  const isSuspicious = checkSuspicious(req.query) || 
                      checkSuspicious(req.body) || 
                      checkSuspicious(req.params);

  if (isSuspicious) {
    logger.warn('Suspicious Request Detected', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      method: req.method,
      url: req.url,
      query: req.query,
      body: req.body,
      timestamp: new Date().toISOString()
    });

    // Optional: Block the request
    // return res.status(403).json({
    //   success: false,
    //   error: {
    //     code: 'SUSPICIOUS_REQUEST',
    //     message: 'Request blocked due to suspicious content'
    //   }
    // });
  }

  next();
};

app.use(securityMonitor);
```

## 📊 **Security Health Check**

### **Health Check Endpoint**
```javascript
const healthCheck = async (req, res) => {
  try {
    // Check database connection
    const dbStatus = await checkDatabaseHealth();
    
    // Check Redis connection (if using)
    const redisStatus = await checkRedisHealth();
    
    // Check external services
    const servicesStatus = await checkExternalServices();
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        database: dbStatus,
        redis: redisStatus,
        services: servicesStatus
      }
    };

    res.status(200).json({
      success: true,
      data: healthData
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Service unhealthy',
        details: error.message
      }
    });
  }
};

app.get('/health', healthCheck);
```

This comprehensive security implementation provides multiple layers of protection for the PM Internship Platform, ensuring data security, request validation, and monitoring capabilities for a production-ready backend system.
