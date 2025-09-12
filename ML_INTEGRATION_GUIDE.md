# 🤖 ML Integration Guide - Ensuring Real ML Recommendations

## 🎯 **Goal**
Ensure that internships shown in the student dashboard are **actually recommended by your ML model** using real student data, not just mock/fallback data.

## 🔍 **Current Status Check**

### **1. Check ML Service Status**
```bash
# Check if ML service is running
curl http://localhost:8000/

# Check ML service health via backend
curl http://localhost:5000/api/v1/ml-status/status
```

### **2. Check Student Data Collection**
```bash
# Check specific student's data readiness
curl http://localhost:5000/api/v1/ml-status/student-data/{userId}
```

### **3. Test ML Recommendations**
```bash
# Test ML recommendations for specific user
curl http://localhost:5000/api/v1/ml-status/test/{userId}
```

## 🚀 **Step-by-Step Setup**

### **Step 1: Start ML Service**
```bash
# Option 1: Use the startup script
python start_ml_service.py

# Option 2: Manual start
cd Ignite-X-ML-Model/Newfolder
python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

### **Step 2: Start Backend**
```bash
cd Ignite-X/Backend
npm run dev
```

### **Step 3: Start Frontend**
```bash
cd Ignite-X/frontend
npm run dev
```

### **Step 4: Start Full System (Recommended)**
```bash
# This starts all services in the correct order
python start_full_system.py
```

## 📊 **Verification Process**

### **1. Frontend Verification**
- Open student dashboard
- Look for **ML Status Indicator** component
- Check if it shows:
  - ✅ **ML Service: Active**
  - ✅ **Data Processing: ML-Powered**
  - ✅ **Recommendation Engine: AI/ML Model**

### **2. Backend Verification**
- Check backend logs for:
  ```
  INFO: Preparing candidate data for ML model
  INFO: ML recommendations received
  ```
- Look for **NOT** these messages:
  ```
  WARN: ML service not available, using fallback recommendations
  WARN: Using fallback recommendations - ML service unavailable
  ```

### **3. ML Service Verification**
- Visit: http://localhost:8000/docs
- Test the `/recommend` endpoint with sample data
- Verify it returns real recommendations with scores

## 🔧 **Data Flow Architecture**

```
Student Registration → Database → Backend API → ML Service → Recommendations
     ↓                    ↓           ↓            ↓            ↓
[Profile Data]    [Prisma/MongoDB] [Node.js]  [FastAPI]   [Frontend Display]
```

### **Student Data Collection**
- **Profile**: Skills, interests, location, work preference
- **Education**: Degree, field of study, institute
- **Applications**: Previous application history

### **ML Model Input**
```json
{
  "education": "Bachelor in Computer Science from University",
  "skills": ["Python", "Machine Learning", "Data Analysis"],
  "interests": ["AI", "Technology"],
  "preferred_location": "Mumbai",
  "mode": "Remote",
  "min_stipend": null,
  "max_duration_weeks": null,
  "top_n": 4
}
```

### **ML Model Output**
```json
{
  "recommendations": [
    {
      "title": "AI/ML Engineer Intern",
      "organization": "AI Innovations Ltd",
      "location": "Bangalore",
      "mode": "Hybrid",
      "duration_weeks": 16,
      "stipend_per_month": 15000,
      "description": "Develop AI solutions...",
      "requirements": "Python, Machine Learning, TensorFlow",
      "score": 0.92
    }
  ]
}
```

## 🛠️ **Troubleshooting**

### **Problem 1: ML Service Not Starting**
```bash
# Check Python dependencies
pip install fastapi uvicorn pandas scikit-learn numpy requests

# Check data file exists
ls Ignite-X-ML-Model/Newfolder/data/internships.csv

# Check port availability
netstat -an | grep 8000
```

### **Problem 2: Backend Can't Connect to ML Service**
```bash
# Check ML service URL in backend
echo $ML_API_URL  # Should be http://localhost:8000

# Test ML service directly
curl -X POST http://localhost:8000/recommend \
  -H "Content-Type: application/json" \
  -d '{"education":"Test","skills":"Python","interests":"AI","top_n":3}'
```

### **Problem 3: Student Data Not Being Collected**
- Check student registration form completion
- Verify database connection
- Check Prisma schema matches data structure

### **Problem 4: Recommendations Still Showing Fallback Data**
- Check backend logs for ML service errors
- Verify ML service is responding to health checks
- Check if candidate data is being properly formatted

## 📈 **Monitoring & Status**

### **Real-time Status Dashboard**
- **Frontend**: ML Status Indicator component shows live status
- **Backend**: `/api/v1/ml-status/status` endpoint
- **ML Service**: `/` endpoint for health check

### **Key Metrics to Monitor**
1. **ML Service Availability**: Is the service running?
2. **Data Quality**: Is student data complete?
3. **Recommendation Quality**: Are scores > 0.5?
4. **Response Time**: ML service response < 5 seconds

## 🎯 **Success Criteria**

### **✅ ML Integration is Working When:**
1. **ML Status Indicator** shows "ML Service: Active"
2. **Backend logs** show "ML recommendations received"
3. **Recommendations** have realistic match scores (0.5-1.0)
4. **Student data** is being used in ML requests
5. **No fallback warnings** in backend logs

### **❌ ML Integration is NOT Working When:**
1. **ML Status Indicator** shows "ML Service: Offline"
2. **Backend logs** show "using fallback recommendations"
3. **Recommendations** are generic/not personalized
4. **Student data** is not being sent to ML service
5. **Fallback warnings** appear in logs

## 🔄 **Data Flow Verification**

### **Step 1: Check Student Data**
```bash
# Verify student has complete profile
curl http://localhost:5000/api/v1/ml-status/student-data/{userId}
```

### **Step 2: Check ML Service**
```bash
# Verify ML service is processing data
curl http://localhost:5000/api/v1/ml-status/test/{userId}
```

### **Step 3: Check Recommendations**
- Open student dashboard
- Check recommendations page
- Verify data source indicator shows "AI-Powered"

## 🚨 **Common Issues & Solutions**

### **Issue: "ML service not available"**
**Solution**: Start ML service with `python start_ml_service.py`

### **Issue: "Using fallback recommendations"**
**Solution**: Check ML service health and data file

### **Issue: Generic recommendations**
**Solution**: Verify student data is complete and being sent to ML

### **Issue: Low match scores**
**Solution**: Check if student skills match internship requirements

## 📝 **Next Steps**

1. **Start the full system**: `python start_full_system.py`
2. **Register a test student** with complete profile data
3. **Check ML status indicator** on dashboard
4. **Verify recommendations** are personalized
5. **Monitor backend logs** for ML service usage

## 🎉 **Expected Result**

When everything is working correctly:
- Students see **personalized AI-powered recommendations**
- Match scores reflect **actual skill alignment**
- Recommendations **adapt to student preferences**
- System shows **"AI-Powered Recommendations"** status
- Backend logs show **successful ML service calls**

The system will seamlessly switch between ML-powered and fallback recommendations based on service availability, ensuring students always get quality recommendations while maintaining transparency about the data source.
