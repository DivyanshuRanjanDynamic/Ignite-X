# 🚀 End-to-End Integration Setup Guide

This guide will help you set up the complete PM Internship AI Platform with ML-powered recommendations.

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **MongoDB Atlas** account (free tier available)
- **Cloudinary** account for file uploads (optional)

## 🔧 Setup Steps

### 1. Backend Setup

```bash
cd Ignite-X/Backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - DATABASE_URL (MongoDB connection string)
# - JWT_ACCESS_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
# - JWT_REFRESH_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
# - ML_API_URL=http://localhost:8000

# Generate Prisma client
npm run prisma:generate

# Push database schema
npm run prisma:push

# Seed admin users
npm run seed:admins

# Start development server
npm run dev
```

### 2. ML Model Setup

```bash
cd Ignite-X-ML-Model/Newfolder

# Install Python dependencies
pip install -r requirements.txt

# Install additional dependencies for API
pip install fastapi uvicorn

# Start ML API server
python start_ml_api.py
```

The ML API will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd Ignite-X/frontend

# Install dependencies
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - VITE_API_BASE_URL=http://localhost:5000/api/v1

# Start development server
npm run dev
```

## 🎯 Integration Features

### ✅ Student Registration → ML Recommendations Flow

1. **Student Registration**: 4-step form collects comprehensive profile data
2. **Data Storage**: Profile data stored in MongoDB with skills, interests, education
3. **ML Integration**: Backend calls ML model API with student profile
4. **Recommendations**: ML model returns personalized internship suggestions
5. **Dashboard Display**: Frontend shows AI-powered recommendations with match scores

### ✅ Admin Internship Management

1. **Create Internships**: Admins can create new internship opportunities
2. **Update Internships**: Edit existing internships with new requirements
3. **Dynamic Updates**: When admins update internships, recommendations automatically adapt
4. **Application Management**: Review and manage student applications

### ✅ Real-time Data Flow

```
Student Registration → Backend Storage → ML Model → Personalized Recommendations → Dashboard Display
Admin Updates → Database Changes → ML Model → Updated Recommendations → Student Dashboard
```

## 🔍 Testing the Integration

### 1. Test Student Registration

1. Go to `http://localhost:5174/register`
2. Complete the 4-step registration form
3. Verify profile data is stored in database
4. Check that skills and interests are properly saved

### 2. Test ML Recommendations

1. Login as a student
2. Go to "Recommended Internships" section
3. Verify that recommendations are loaded from ML model
4. Check that match scores are displayed
5. Test the refresh button to get new recommendations

### 3. Test Admin Features

1. Login as admin (use seeded admin credentials)
2. Create a new internship
3. Update an existing internship
4. Verify that student recommendations update accordingly

## 🐛 Troubleshooting

### ML Model Not Responding

```bash
# Check if ML API is running
curl http://localhost:8000/

# Check ML API logs
# Look for any import errors or data loading issues
```

### Backend Connection Issues

```bash
# Check backend logs
cd Ignite-X/Backend
npm run dev

# Check database connection
# Verify DATABASE_URL in .env file
```

### Frontend API Errors

```bash
# Check browser console for API errors
# Verify VITE_API_BASE_URL in frontend .env
# Check if backend is running on correct port
```

## 📊 Data Flow Verification

### 1. Check Student Profile Data

```javascript
// In browser console on student dashboard
// Check if profile data is properly loaded
console.log('Profile data:', localStorage.getItem('userProfile'));
```

### 2. Verify ML API Response

```bash
# Test ML API directly
curl -X POST http://localhost:8000/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "education": "Computer Science",
    "skills": "Python, Machine Learning",
    "interests": "Technology",
    "preferred_location": "Remote",
    "top_n": 5
  }'
```

### 3. Check Backend Logs

```bash
# Look for ML service calls in backend logs
# Should see: "Requesting ML recommendations"
# Should see: "ML recommendations received"
```

## 🎉 Success Indicators

✅ **Student Registration**: Form submits successfully and profile is created  
✅ **ML Integration**: Recommendations load with real ML scores  
✅ **Admin Management**: Can create/update internships  
✅ **Dynamic Updates**: Recommendations change when admin updates data  
✅ **Error Handling**: Fallback recommendations when ML service is down  
✅ **Real-time Flow**: End-to-end data flow works seamlessly  

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secrets
JWT_ACCESS_SECRET=your_64_character_secret_here
JWT_REFRESH_SECRET=your_64_character_secret_here

# ML Model API
ML_API_URL=http://localhost:8000

# Email (Optional)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## 🚀 Production Deployment

1. **Backend**: Deploy to Railway, Render, or AWS
2. **ML Model**: Deploy to Railway, Heroku, or AWS Lambda
3. **Frontend**: Deploy to Vercel, Netlify, or AWS S3
4. **Database**: Use MongoDB Atlas production cluster
5. **Environment**: Update all URLs to production domains

## 📞 Support

If you encounter any issues:

1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all services are running on correct ports
4. Check database connectivity
5. Verify ML model data file exists and is accessible

The integration is now complete and ready for production use! 🎉
