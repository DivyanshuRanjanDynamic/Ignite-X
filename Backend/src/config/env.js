import dotenv from 'dotenv';
import Joi from 'joi';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

dotenv.config({ path: join(rootDir, '.env') });

// Environment variables validation schema
const envSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(5000),
  API_VERSION: Joi.string().default('v1'),

  // Database
  DATABASE_URL: Joi.string().required()
    .messages({
      'any.required': 'DATABASE_URL is required. Please set up MongoDB connection string.',
    }),

  // JWT Secrets
  JWT_ACCESS_SECRET: Joi.string().min(32).required()
    .messages({
      'any.required': 'JWT_ACCESS_SECRET is required. Generate with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"',
      'string.min': 'JWT_ACCESS_SECRET must be at least 32 characters long',
    }),
  JWT_REFRESH_SECRET: Joi.string().min(32).required()
    .messages({
      'any.required': 'JWT_REFRESH_SECRET is required. Generate with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"',
      'string.min': 'JWT_REFRESH_SECRET must be at least 32 characters long',
    }),
  JWT_EMAIL_SECRET: Joi.string().min(32).default('default_email_secret_key'),
  JWT_RESET_SECRET: Joi.string().min(32).default('default_reset_secret_key'),

  // JWT Expiration
  JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('30d'),
  JWT_EMAIL_EXPIRY: Joi.string().default('24h'),
  JWT_RESET_EXPIRY: Joi.string().default('1h'),

  // Security
  BCRYPT_SALT_ROUNDS: Joi.number().default(12),
  CORS_ORIGINS: Joi.string().default('http://localhost:3000,http://localhost:5173'),
  RATE_LIMIT_WHITELIST: Joi.string().default('127.0.0.1,::1'),

  // Frontend URLs
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
  FRONTEND_LOGIN_URL: Joi.string().uri().default('http://localhost:3000/login'),
  FRONTEND_DASHBOARD_URL: Joi.string().uri().default('http://localhost:3000/dashboard'),
  FRONTEND_VERIFY_EMAIL_URL: Joi.string().uri().default('http://localhost:3000/verify-email'),
  FRONTEND_RESET_PASSWORD_URL: Joi.string().uri().default('http://localhost:3000/reset-password'),

  // Email Configuration
  SMTP_HOST: Joi.string().default('smtp.gmail.com'),
  SMTP_PORT: Joi.number().default(587),
  SMTP_SECURE: Joi.boolean().default(false),
  SMTP_USER: Joi.string().email().default('your_email@gmail.com'),
  SMTP_PASS: Joi.string().default('your_app_password'),
  FROM_EMAIL: Joi.string().email().default('noreply@pminternship.gov.in'),
  FROM_NAME: Joi.string().default('PM Internship Platform'),

  // File Storage (Cloudinary)
  CLOUDINARY_CLOUD_NAME: Joi.string().default('demo_cloud'),
  CLOUDINARY_API_KEY: Joi.string().default('demo_key'),
  CLOUDINARY_API_SECRET: Joi.string().default('demo_secret'),

  // OAuth (Optional)
  GOOGLE_CLIENT_ID: Joi.string().default(''),
  GOOGLE_CLIENT_SECRET: Joi.string().default(''),
  GITHUB_CLIENT_ID: Joi.string().default(''),
  GITHUB_CLIENT_SECRET: Joi.string().default(''),

  // ML Model API
  ML_API_URL: Joi.string().uri().default('http://localhost:8000'),
  ML_SERVICE_URL: Joi.string().uri().default('http://localhost:8000'),
  ML_SERVICE_API_KEY: Joi.string().default('demo_ml_key'),

  // Redis (Optional)
  REDIS_URL: Joi.string().default('redis://localhost:6379'),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  LOG_DIR: Joi.string().default('./logs'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(1000),
  AUTH_RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  AUTH_RATE_LIMIT_MAX_REQUESTS: Joi.number().default(10),

  // Feature Flags
  ENABLE_OAUTH_LOGIN: Joi.boolean().default(true),
  ENABLE_EMAIL_NOTIFICATIONS: Joi.boolean().default(true),
  ENABLE_FILE_UPLOADS: Joi.boolean().default(true),
  ENABLE_SWAGGER: Joi.boolean().default(true),
  
  // Resume V2 Feature Flags
  FEATURE_RESUME_V2: Joi.boolean().default(true),
  FEATURE_RESUME_V2_ROLLOUT: Joi.number().default(100),
  FEATURE_RESUME_V2_USERS: Joi.string().default(''),
  FEATURE_RESUME_V2_ROLES: Joi.string().default('STUDENT,ADMIN'),
  
  // ATS ML Service Feature Flags
  FEATURE_ATS_ML_SERVICE: Joi.boolean().default(true),
  FEATURE_ATS_ML_SERVICE_ROLLOUT: Joi.number().default(100),
  
  // YouTube Integration Feature Flags
  FEATURE_YOUTUBE_INTEGRATION: Joi.boolean().default(true),
  FEATURE_YOUTUBE_INTEGRATION_ROLLOUT: Joi.number().default(100),
  FEATURE_YOUTUBE_INTEGRATION_ROLES: Joi.string().default('STUDENT'),
  
  // ATS Adapter Configuration
  ATS_ADAPTER_TYPE: Joi.string().default('rule-based'),

  // File Upload Settings
  MAX_FILE_SIZE: Joi.number().default(5242880), // 5MB
  MAX_FILES_COUNT: Joi.number().default(5),

}).unknown(); // Allow unknown environment variables

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env, {
  allowUnknown: true,
  stripUnknown: false,
});

if (error) {
  console.error('❌ Config validation error:', error.message);
  console.error('\n🔧 Environment Setup Guide:');
  console.error('1. Copy .env.example to .env');
  console.error('2. Update the required values in .env file');
  console.error('3. Generate JWT secrets using: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  console.error('4. Set up MongoDB connection string');
  console.error('5. Configure email settings (Gmail App Password)');
  
  process.exit(1);
}

// Configuration object
const config = {
  // Application
  app: {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    apiVersion: envVars.API_VERSION,
    isDevelopment: envVars.NODE_ENV === 'development',
    isProduction: envVars.NODE_ENV === 'production',
    isTest: envVars.NODE_ENV === 'test',
  },

  // Database
  database: {
    url: envVars.DATABASE_URL,
    maxConnections: envVars.DB_MAX_CONNECTIONS,
    connectionTimeout: envVars.DB_CONNECTION_TIMEOUT,
  },

  // JWT Configuration
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    emailSecret: envVars.JWT_EMAIL_SECRET,
    resetSecret: envVars.JWT_RESET_SECRET,
    accessExpiry: envVars.JWT_ACCESS_EXPIRY,
    refreshExpiry: envVars.JWT_REFRESH_EXPIRY,
    emailExpiry: envVars.JWT_EMAIL_EXPIRY,
    resetExpiry: envVars.JWT_RESET_EXPIRY,
  },

  // Security
  security: {
    bcryptSaltRounds: envVars.BCRYPT_SALT_ROUNDS,
    corsOrigins: envVars.CORS_ORIGINS.split(',').map(origin => origin.trim()),
    rateLimitWhitelist: envVars.RATE_LIMIT_WHITELIST.split(',').map(ip => ip.trim()),
  },

  // Frontend URLs
  frontend: {
    baseUrl: envVars.FRONTEND_URL,
    loginUrl: envVars.FRONTEND_LOGIN_URL,
    dashboardUrl: envVars.FRONTEND_DASHBOARD_URL,
    verifyEmailUrl: envVars.FRONTEND_VERIFY_EMAIL_URL,
    resetPasswordUrl: envVars.FRONTEND_RESET_PASSWORD_URL,
  },

  // Email Configuration
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      secure: envVars.SMTP_SECURE,
      auth: {
        user: envVars.SMTP_USER,
        pass: envVars.SMTP_PASS,
      },
    },
    from: {
      email: envVars.FROM_EMAIL,
      name: envVars.FROM_NAME,
    },
  },

  // File Storage
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },

  // OAuth
  oauth: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: envVars.GITHUB_CLIENT_ID,
      clientSecret: envVars.GITHUB_CLIENT_SECRET,
    },
  },

  // ML Model API
  ml: {
    apiUrl: envVars.ML_API_URL,
    serviceUrl: envVars.ML_SERVICE_URL,
    apiKey: envVars.ML_SERVICE_API_KEY,
  },

  // Redis
  redis: {
    url: envVars.REDIS_URL,
  },

  // Logging
  logging: {
    level: envVars.LOG_LEVEL,
    dir: envVars.LOG_DIR,
  },

  // Rate Limiting
  rateLimit: {
    general: {
      windowMs: envVars.RATE_LIMIT_WINDOW_MS,
      max: envVars.RATE_LIMIT_MAX_REQUESTS,
    },
    auth: {
      windowMs: envVars.AUTH_RATE_LIMIT_WINDOW_MS,
      max: envVars.AUTH_RATE_LIMIT_MAX_REQUESTS,
    },
  },

  // Feature Flags
  features: {
    oauthLogin: envVars.ENABLE_OAUTH_LOGIN,
    emailNotifications: envVars.ENABLE_EMAIL_NOTIFICATIONS,
    fileUploads: envVars.ENABLE_FILE_UPLOADS,
    swagger: envVars.ENABLE_SWAGGER,
    resumeV2: envVars.FEATURE_RESUME_V2,
    atsMlService: envVars.FEATURE_ATS_ML_SERVICE,
    youtubeIntegration: envVars.FEATURE_YOUTUBE_INTEGRATION,
  },

  // Resume V2 Feature Flags
  resumeV2: {
    enabled: envVars.FEATURE_RESUME_V2,
    rolloutPercentage: envVars.FEATURE_RESUME_V2_ROLLOUT,
    targetUsers: envVars.FEATURE_RESUME_V2_USERS.split(',').filter(u => u.trim()),
    targetRoles: envVars.FEATURE_RESUME_V2_ROLES.split(',').filter(r => r.trim()),
  },

  // ATS Configuration
  ats: {
    adapterType: envVars.ATS_ADAPTER_TYPE,
    mlServiceUrl: envVars.ML_SERVICE_URL,
    mlServiceApiKey: envVars.ML_SERVICE_API_KEY,
  },

  // File Upload
  upload: {
    maxFileSize: envVars.MAX_FILE_SIZE,
    maxFilesCount: envVars.MAX_FILES_COUNT,
  },
};

// Log configuration status
if (config.app.isDevelopment) {
  console.log('🔧 Configuration loaded successfully');
  console.log(`📦 Environment: ${config.app.env}`);
  console.log(`🚀 Port: ${config.app.port}`);
  console.log(`🗄️ Database: ${config.database.url.replace(/\/\/.*@/, '//***@')}`);
  console.log(`📧 Email: ${config.email.smtp.host}:${config.email.smtp.port}`);
}

export default config;
