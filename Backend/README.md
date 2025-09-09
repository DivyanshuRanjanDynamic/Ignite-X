# PM Internship Platform - Backend API

A comprehensive backend API for the PM Internship Platform that handles student registration, admin management, authentication, and file uploads with full integration to the frontend React application.

## 🚀 Features

### Authentication & Authorization
- **Student Registration**: 4-step comprehensive registration form
  - Personal details (name, email, phone, date of birth, gender)
  - Education & skills (education level, degree, institution, domain, skills, experience)
  - Location & interests (state, city, career interests, work preference)
  - Security & documents (password, resume upload, profile photo upload)
- **Admin Registration**: Simplified registration for admin accounts
- **Login System**: Role-based login with userType selection (student/admin)
- **Email Verification**: Required for student accounts
- **JWT Authentication**: Access and refresh token management
- **Password Management**: Forgot password, reset password, change password

### File Upload System
- **Resume Upload**: PDF, DOC, DOCX support (max 5MB)
- **Profile Photo Upload**: JPEG, PNG, WebP support (max 2MB)
- **Secure Storage**: Organized file structure with unique filenames
- **File Validation**: MIME type and size validation
- **Static File Serving**: Direct URL access to uploaded files

### Validation & Security
- **Request Validation**: Comprehensive Joi schemas for all endpoints
- **Input Sanitization**: Automatic data cleaning and validation
- **Security Headers**: Helmet.js security middleware
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against API abuse (planned)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **File Upload**: Multer
- **Security**: Helmet, bcryptjs
- **Logging**: Winston
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## ⚡ Quick Start

### 1. Clone & Install
```bash
cd backend
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory:

```env
# Application Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1
BASE_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/pm_internship_platform"

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secure-access-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here
JWT_EMAIL_SECRET=your-super-secure-email-secret-key-here
JWT_RESET_SECRET=your-super-secure-reset-secret-key-here

JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
JWT_EMAIL_EXPIRE=24h
JWT_RESET_EXPIRE=30m

# Upload Configuration
UPLOAD_PATH=uploads
MAX_FILE_SIZE=10485760

# Admin Registration Token (optional)
ADMIN_REGISTRATION_TOKEN=admin-secret-token

# CORS Origins (comma separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:3001
```

### 3. Database Setup
```bash
# Install Prisma CLI globally
npm install -g prisma

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication Endpoints

#### Student Registration
```http
POST /api/v1/auth/register/student
Content-Type: multipart/form-data

# Form fields (all from 4-step frontend form):
name: "John Doe"
email: "john@example.com"
phone: "+919876543210"
dateOfBirth: "1995-01-01"
gender: "MALE"
education: "undergraduate"
degree: "Computer Science"
institution: "XYZ University"
graduationYear: 2023
domain: "technology"
skills: ["JavaScript", "React", "Node.js"]
experience: "oneToTwo"
state: "maharashtra"
city: "Mumbai"
interests: ["web-development", "mobile-apps"]
workPreference: "hybrid"
password: "SecurePass123!"
confirmPassword: "SecurePass123!"

# Optional files:
resume: (file)
profilePhoto: (file)
```

#### Admin Registration
```http
POST /api/v1/auth/register/admin
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "AdminPass123!",
  "phone": "+919876543210",
  "department": "IT",
  "designation": "System Administrator",
  "adminToken": "admin-secret-token"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password",
  "userType": "student",
  "remember": false
}
```

#### Email Verification
```http
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "token": "jwt-verification-token"
}
```

#### Password Management
```http
# Forgot Password
POST /api/v1/auth/forgot-password
{
  "email": "user@example.com"
}

# Reset Password
POST /api/v1/auth/reset-password
{
  "token": "jwt-reset-token",
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}

# Change Password (authenticated)
POST /api/v1/auth/change-password
Authorization: Bearer <access-token>
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

### Other Endpoints
```http
# Health Check
GET /health

# API Info
GET /api/v1

# Current User (authenticated)
GET /api/v1/auth/me
Authorization: Bearer <access-token>

# Logout
POST /api/v1/auth/logout

# Refresh Token
POST /api/v1/auth/refresh-token
{
  "refreshToken": "jwt-refresh-token"
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # Database connection
│   │   ├── env.js        # Environment variables
│   │   └── logger.js     # Winston logger setup
│   ├── controllers/      # Route controllers
│   │   └── authController.js
│   ├── middleware/       # Express middleware
│   │   └── auth.js       # JWT authentication middleware
│   ├── routes/           # Express routes
│   │   ├── index.js      # Main routes file
│   │   └── authRoutes.js # Authentication routes
│   ├── services/         # Business logic services
│   │   └── uploadService.js # File upload service
│   ├── utils/            # Utility functions
│   │   ├── jwt.js        # JWT utilities
│   │   └── password.js   # Password utilities
│   ├── validators/       # Request validation schemas
│   │   └── authValidators.js # Joi validation schemas
│   └── server.js         # Express server setup
├── uploads/              # File upload directory
│   ├── resumes/         # Student resumes
│   ├── profile-photos/  # Profile pictures
│   └── temp/           # Temporary files
├── prisma/              # Prisma database schema
├── package.json
└── README.md
```

## 🎯 Frontend Integration

This backend is fully integrated with the frontend React application:

### Student Registration Integration
- **4-Step Form Support**: All form fields from the frontend are validated and processed
- **File Upload**: Handles resume and profile photo uploads from the frontend form
- **Real-time Validation**: Joi schemas match frontend validation requirements
- **Response Format**: Consistent JSON responses expected by frontend

### Login Integration
- **UserType Selection**: Supports both student and admin login from same endpoint
- **Token Management**: Provides both access and refresh tokens for localStorage
- **Redirect URLs**: Returns appropriate redirect paths based on user role
- **Error Handling**: Consistent error responses for frontend error handling

### Authentication State
- **JWT Tokens**: Access tokens for API requests, refresh tokens for session management
- **User Data**: Complete user profile data returned after successful authentication
- **Role-Based Access**: Different permissions and data based on user role

## 🔧 Development

### Available Scripts
```bash
# Development server with hot reload
npm run dev

# Production server
npm run start

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:reset       # Reset database
npm run db:seed        # Seed database

# Testing
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode

# Code quality
npm run lint           # ESLint
npm run format         # Prettier
```

### Environment Variables
See `.env.example` for all available environment variables with descriptions.

### Database Schema
The application uses Prisma ORM. Database schema is defined in `prisma/schema.prisma`.

Key models:
- **User**: Student and admin accounts
- **Profile**: Extended user profile information
- **RefreshToken**: JWT refresh token management

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Security**: Separate secrets for different token types
- **File Upload Security**: MIME type validation, file size limits
- **Input Validation**: Comprehensive Joi schemas
- **Security Headers**: Helmet.js middleware
- **CORS Protection**: Configurable allowed origins
- **Rate Limiting**: API abuse protection (planned)

## 📊 Monitoring & Logging

- **Winston Logger**: Structured logging with different levels
- **Request Logging**: HTTP request/response logging
- **Error Tracking**: Comprehensive error logging
- **Health Checks**: Database and application health endpoints

## 🚀 Deployment

### Production Environment
1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set secure JWT secrets
4. Configure CORS origins for production domains
5. Set up file upload storage (local or cloud)
6. Configure SSL/HTTPS

### Docker Support (planned)
```dockerfile
# Dockerfile for containerized deployment
FROM node:18-alpine
# ... Docker configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and formatting
6. Submit a pull request

## 📝 License

This project is part of the Smart India Hackathon 2024 submission.

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

**File Upload Issues**
- Check file size limits
- Verify MIME types
- Ensure upload directory exists

**JWT Token Issues**
- Verify JWT secrets are set
- Check token expiration times
- Ensure consistent token format

**CORS Issues**
- Add frontend URL to CORS_ORIGINS
- Check for trailing slashes
- Verify HTTP vs HTTPS

### Getting Help

For development issues:
1. Check the logs in `logs/` directory
2. Use the `/health` endpoint for system status
3. Review the console output for detailed error messages
4. Check network tab for API response details

---

Built with ❤️ for Smart India Hackathon 2024
