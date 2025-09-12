# Ignite-X Integration Guide

## 🎯 System Overview

Ignite-X is a comprehensive internship recommendation platform that integrates:
- **Frontend**: React-based user interface with multi-language support
- **Backend**: Node.js/Express API with MongoDB database
- **ML Model**: Python-based recommendation engine using scikit-learn

## 🚀 Quick Start

### Option 1: Automated Startup (Recommended)
```bash
# Start all services with one command
python start_system.py
```

### Option 2: Manual Startup
```bash
# Terminal 1: Start ML Service
cd Ignite-X-ML-Model/Newfolder
python start_ml_service.py

# Terminal 2: Start Backend
cd Backend
npm install
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm install
npm run dev
```

## 🔧 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   ML Model      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Python)      │
│   Port: 5173    │    │   Port: 5000    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface│    │   MongoDB       │    │   CSV Data      │
│   Multi-language│    │   Database      │    │   Internships   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Data Flow

### Student Registration → ML Recommendations
1. **Student Registration**: 4-step form collects comprehensive profile data
2. **Data Storage**: Profile stored in MongoDB with skills, interests, education
3. **ML Processing**: Backend sends student data to ML model
4. **Recommendations**: ML model returns personalized internship matches
5. **Display**: Frontend shows recommendations with match scores

### Admin Management → Dynamic Updates
1. **Admin Login**: Pre-authorized admin accounts only
2. **Internship Management**: Create, update, delete internship listings
3. **Real-time Updates**: Changes immediately affect recommendations
4. **Analytics**: Comprehensive dashboard with statistics

## 🎯 Key Features

### For Students
- ✅ **Comprehensive Registration**: 4-step form with skills, interests, education
- ✅ **AI-Powered Recommendations**: Personalized internship suggestions
- ✅ **Multi-language Support**: English, Hindi, Bengali, Marathi, Telugu
- ✅ **Application Tracking**: Monitor application status
- ✅ **Profile Management**: Update skills and preferences

### For Admins
- ✅ **Dynamic Internship Management**: Create and manage listings
- ✅ **User Management**: Monitor student registrations
- ✅ **Analytics Dashboard**: Comprehensive statistics and trends
- ✅ **Application Review**: Review and manage student applications

### For System
- ✅ **ML Integration**: Real-time recommendation engine
- ✅ **Bot Protection**: Advanced security measures
- ✅ **File Upload**: Resume and profile picture support
- ✅ **Email Verification**: Secure account activation

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/register/student` - Student registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Internships
- `GET /api/v1/internships` - List internships
- `GET /api/v1/internships/recommendations` - ML recommendations
- `POST /api/v1/internships/:id/apply` - Apply to internship
- `GET /api/v1/internships/:id` - Get internship details

### Admin
- `POST /api/v1/internships` - Create internship (Admin)
- `PUT /api/v1/internships/:id` - Update internship (Admin)
- `DELETE /api/v1/internships/:id` - Delete internship (Admin)

### ML Service
- `GET /` - Health check
- `POST /recommend` - Get recommendations

## 🧪 Testing

### Run Integration Tests
```bash
# Ensure all services are running first
python test_integration.py
```

### Test Individual Components
```bash
# Test ML service
curl http://localhost:8000/

# Test backend
curl http://localhost:5000/api/v1/health

# Test frontend
curl http://localhost:5173/
```

## 📁 Project Structure

```
Ignite-X/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── api/            # API client
│   │   └── contexts/       # React contexts
│   └── package.json
├── Backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   └── config/         # Configuration
│   └── package.json
├── Ignite-X-ML-Model/       # Python ML model
│   └── Newfolder/
│       ├── api.py          # FastAPI service
│       ├── notebooks/      # ML algorithms
│       └── data/           # Training data
├── start_system.py         # System startup script
├── test_integration.py     # Integration tests
└── INTEGRATION_GUIDE.md    # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/ignite-x
JWT_SECRET=your-jwt-secret
ML_API_URL=http://localhost:8000
```

#### ML Service
```env
ML_SERVICE_PORT=8000
ML_SERVICE_HOST=0.0.0.0
```

### Database Setup
```bash
# MongoDB should be running
# Database will be created automatically
# Run migrations if needed
cd Backend
npm run prisma:push
```

## 🚨 Troubleshooting

### Common Issues

1. **ML Service Not Responding**
   ```bash
   # Check if Python dependencies are installed
   cd Ignite-X-ML-Model/Newfolder
   pip install -r requirements.txt
   
   # Start ML service manually
   python start_ml_service.py
   ```

2. **Backend Connection Issues**
   ```bash
   # Check MongoDB is running
   # Verify environment variables
   # Check port 5000 is available
   ```

3. **Frontend Build Issues**
   ```bash
   # Clear node_modules and reinstall
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

4. **Integration Test Failures**
   ```bash
   # Ensure all services are running
   # Check service URLs in test script
   # Verify database connectivity
   ```

### Logs and Debugging

- **Backend Logs**: Check `Backend/logs/` directory
- **ML Service Logs**: Console output from Python service
- **Frontend Logs**: Browser developer console
- **Integration Test Report**: `integration_test_report.json`

## 📈 Performance Optimization

### ML Model
- Recommendations cached for 5 minutes
- Fallback recommendations when ML service unavailable
- Efficient TF-IDF vectorization

### Backend
- Database connection pooling
- JWT token caching
- Rate limiting on API endpoints

### Frontend
- Lazy loading of components
- Image optimization
- Bundle splitting

## 🔒 Security Features

- **Bot Protection**: Advanced CAPTCHA and behavior analysis
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive data validation
- **Rate Limiting**: API abuse prevention
- **Admin Access Control**: Pre-authorized admin accounts only

## 🌐 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up reverse proxy (nginx)
4. Enable HTTPS
5. Configure monitoring and logging

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Run integration tests
3. Check service logs
4. Verify all dependencies are installed

## 🎉 Success Criteria

The system is fully integrated when:
- ✅ All services start successfully
- ✅ Student registration works end-to-end
- ✅ ML recommendations are generated
- ✅ Admin can manage internships
- ✅ Integration tests pass
- ✅ Frontend displays recommendations

---

**Happy Coding! 🚀**
