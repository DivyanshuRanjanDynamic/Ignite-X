import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Clock, CheckCircle, XCircle, AlertCircle,
  MapPin, Briefcase, Star, Eye, RefreshCw, TrendingUp,
  User, MessageCircle, Share, BarChart3, Target, Calendar,
  TrendingDown, TrendingUp as TrendingUpIcon, Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AppliedInternships() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Under Review");
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Real applied internships data
  const appliedInternships = [
    {
      id: 1,
      title: "Digital India Intern",
      company: "Ministry of Electronics & IT",
      location: "Remote",
      type: "Government",
      appliedDate: "2024-01-15",
      status: "Interview",
      currentStage: "Interview",
      image: "/src/assets/hero1.png",
      companyLogo: "/src/assets/hero2.png",
      stages: [
        { name: "Application Submitted", status: "completed", date: "2024-01-15" },
        { name: "Resume Screening", status: "completed", date: "2024-01-18" },
        { name: "Coding Round", status: "completed", date: "2024-01-22" },
        { name: "Interview", status: "current", date: "2024-01-25" },
        { name: "HR Round", status: "pending", date: null },
        { name: "Final Selection", status: "pending", date: null }
      ],
      match: 95,
      stipend: "₹12,000",
      duration: "3 Months"
    },
    {
      id: 2,
      title: "Rural Development Intern",
      company: "Ministry of Rural Development",
      location: "Delhi",
      type: "Social Impact",
      appliedDate: "2024-01-10",
      status: "Reviewing",
      currentStage: "Resume Screening",
      image: "/src/assets/hero3.png",
      companyLogo: "/src/assets/hero4.png",
      stages: [
        { name: "Application Submitted", status: "completed", date: "2024-01-10" },
        { name: "Resume Screening", status: "current", date: "2024-01-12" },
        { name: "Coding Round", status: "pending", date: null },
        { name: "Interview", status: "pending", date: null },
        { name: "HR Round", status: "pending", date: null },
        { name: "Final Selection", status: "pending", date: null }
      ],
      match: 92,
      stipend: "₹10,000",
      duration: "6 Months"
    },
    {
      id: 3,
      title: "Skill Development Intern",
      company: "Ministry of Skill Development",
      location: "Mumbai",
      type: "Education",
      appliedDate: "2024-01-05",
      status: "Selected",
      currentStage: "Final Selection",
      image: "/src/assets/hero5.png",
      companyLogo: "/src/assets/hero6.png",
      stages: [
        { name: "Application Submitted", status: "completed", date: "2024-01-05" },
        { name: "Resume Screening", status: "completed", date: "2024-01-08" },
        { name: "Coding Round", status: "completed", date: "2024-01-12" },
        { name: "Interview", status: "completed", date: "2024-01-18" },
        { name: "HR Round", status: "completed", date: "2024-01-22" },
        { name: "Final Selection", status: "completed", date: "2024-01-25" }
      ],
      match: 88,
      stipend: "₹8,000",
      duration: "4 Months"
    },
    {
      id: 4,
      title: "Healthcare Outreach Intern",
      company: "Ministry of Health & Family Welfare",
      location: "Hyderabad",
      type: "Healthcare",
      appliedDate: "2024-01-20",
      status: "Rejected",
      currentStage: "Resume Screening",
      image: "/src/assets/hero2.png",
      companyLogo: "/src/assets/hero3.png",
      stages: [
        { name: "Application Submitted", status: "completed", date: "2024-01-20" },
        { name: "Resume Screening", status: "rejected", date: "2024-01-23" },
        { name: "Coding Round", status: "cancelled", date: null },
        { name: "Interview", status: "cancelled", date: null },
        { name: "HR Round", status: "cancelled", date: null },
        { name: "Final Selection", status: "cancelled", date: null }
      ],
      match: 85,
      stipend: "₹9,000",
      duration: "5 Months"
    }
  ];

  // Filter applications based on active tab
  const getFilteredApplications = () => {
    switch (activeTab) {
      case "Under Review":
        return appliedInternships.filter(app => app.status === "Reviewing");
      case "Interview":
        return appliedInternships.filter(app => app.status === "Interview");
      case "Selected":
        return appliedInternships.filter(app => app.status === "Selected");
      default:
        return appliedInternships;
    }
  };

  // Calculate dynamic data based on active tab and actual applications
  const getStudentProfileData = () => {
    const filteredApps = getFilteredApplications();
    
    return {
      totalApplications: filteredApps.length,
      underReview: appliedInternships.filter(app => app.status === "Reviewing").length,
      interviews: appliedInternships.filter(app => app.status === "Interview").length,
      selected: appliedInternships.filter(app => app.status === "Selected").length,
      profileViews: [12, 8, 15, 22, 18, 25, 20], // Weekly profile views
      applicationBreakdown: [
        { 
          category: "Digital India Intern", 
          count: filteredApps.filter(app => app.title.includes("Digital India")).length,
          progress: Math.round((filteredApps.filter(app => app.title.includes("Digital India")).length / Math.max(filteredApps.length, 1)) * 100), 
          color: "blue" 
        },
        { 
          category: "Rural Development", 
          count: filteredApps.filter(app => app.title.includes("Rural")).length,
          progress: Math.round((filteredApps.filter(app => app.title.includes("Rural")).length / Math.max(filteredApps.length, 1)) * 100), 
          color: "green" 
        },
        { 
          category: "Skill Development", 
          count: filteredApps.filter(app => app.title.includes("Skill")).length,
          progress: Math.round((filteredApps.filter(app => app.title.includes("Skill")).length / Math.max(filteredApps.length, 1)) * 100), 
          color: "purple" 
        }
      ]
    };
  };

  const studentProfile = getStudentProfileData();

  // Generate activity data based on actual applications
  const generateActivityData = () => {
    const activityDates = [];
    const recentActivities = [];
    
    appliedInternships.forEach(app => {
      // Application submission date
      const appliedDate = new Date(app.appliedDate);
      activityDates.push({
        date: appliedDate.getDate(),
        type: "application",
        color: "green",
        title: app.title,
        company: app.company
      });
      
      // Interview dates (if status is Interview or Selected)
      if (app.status === "Interview" || app.status === "Selected") {
        const interviewDate = new Date(appliedDate);
        interviewDate.setDate(interviewDate.getDate() + 10); // Interview 10 days after application
        activityDates.push({
          date: interviewDate.getDate(),
          type: "interview",
          color: "blue",
          title: app.title,
          company: app.company
        });
      }
      
      // Rejection dates (if status is Rejected)
      if (app.status === "Rejected") {
        const rejectionDate = new Date(appliedDate);
        rejectionDate.setDate(rejectionDate.getDate() + 5); // Rejection 5 days after application
        activityDates.push({
          date: rejectionDate.getDate(),
          type: "rejection",
          color: "red",
          title: app.title,
          company: app.company
        });
      }
    });

    // Generate recent activities
    appliedInternships.slice(0, 3).forEach(app => {
      if (app.status === "Interview") {
        recentActivities.push({
          type: "interview",
          text: `Interview scheduled for ${app.title}`,
          color: "blue",
          date: app.appliedDate
        });
      } else if (app.status === "Selected") {
        recentActivities.push({
          type: "selected",
          text: `Selected for ${app.title}`,
          color: "green",
          date: app.appliedDate
        });
      } else if (app.status === "Reviewing") {
        recentActivities.push({
          type: "application",
          text: `Application submitted to ${app.title}`,
          color: "green",
          date: app.appliedDate
        });
      } else if (app.status === "Rejected") {
        recentActivities.push({
          type: "rejection",
          text: `Application rejected for ${app.title}`,
          color: "red",
          date: app.appliedDate
        });
      }
    });

    return { activityDates, recentActivities };
  };

  const { activityDates, recentActivities } = generateActivityData();

  const applicationActivity = {
    period: selectedPeriod === "current" ? "From 15 Nov - 15 Dec, 2024" : "From 1 Oct - 31 Oct, 2024",
    totalApplications: appliedInternships.length,
    totalInterviews: appliedInternships.filter(app => app.status === "Interview").length,
    totalSelected: appliedInternships.filter(app => app.status === "Selected").length,
    activityDates,
    recentActivities
  };

  const successInsights = {
    successRate: Math.round((appliedInternships.filter(app => app.status === "Selected").length / appliedInternships.length) * 100),
    interviewConversion: 12,
    trendData: [20, 35, 45, 60, Math.round((appliedInternships.filter(app => app.status === "Selected").length / appliedInternships.length) * 100)],
    uniqueFinding: "You have higher success rates when applying to government internships. Your profile matches well with PM Internship Scheme requirements!"
  };

  const handlePeriodChange = () => {
    setSelectedPeriod(prev => prev === "current" ? "previous" : "current");
  };

  const handleViewProfile = () => {
    navigate('/student-dashboard/profile');
  };

  const handleViewDetailedAnalytics = () => {
    setShowDetailedAnalytics(!showDetailedAnalytics);
  };

  const handleApplicationClick = (applicationId) => {
    navigate(`/internship/${applicationId}`);
  };

  const handleCalendarDateClick = (date) => {
    const activityForDate = activityDates.find(activity => activity.date === date);
    if (activityForDate) {
      setSelectedDate(activityForDate);
    } else {
      setSelectedDate(null);
    }
  };

  const getDateColor = (date) => {
    const activity = activityDates.find(activity => activity.date === date);
    if (!activity) return "text-gray-600 hover:bg-gray-100";
    
    switch (activity.type) {
      case "application":
        return "bg-green-100 text-green-600 font-semibold hover:bg-green-200";
      case "interview":
        return "bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200";
      case "rejection":
        return "bg-red-100 text-red-600 font-semibold hover:bg-red-200";
      default:
        return "text-gray-600 hover:bg-gray-100";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Real-Time Analytics & Insights
        </h1>
        <p className="text-gray-600 text-lg">
          Track your internship journey with comprehensive analytics and personalized insights
        </p>
      </motion.div>

      {/* Dashboard Cards */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Student Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Student Profile</h3>
                <p className="text-sm text-gray-500">@student_user</p>
              </div>
            </div>
            <MessageCircle className="w-5 h-5 text-gray-400" />
          </div>

          {/* Applications Count */}
          <div className="mb-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">{studentProfile.totalApplications}</div>
            <div className="text-sm text-gray-600">
              {activeTab === "Under Review" ? "Applications Under Review" :
               activeTab === "Interview" ? "Interview Applications" :
               activeTab === "Selected" ? "Selected Applications" :
               "Applications Submitted"}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            {["Under Review", "Interview", "Selected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Application Breakdown */}
          <div className="space-y-4 mb-6">
            {studentProfile.applicationBreakdown
              .filter(item => item.count > 0)
              .map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.color === "blue" ? "bg-blue-500" :
                      item.color === "green" ? "bg-green-500" : "bg-purple-500"
                    }`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {studentProfile.applicationBreakdown.filter(item => item.count > 0).length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No applications in this category
              </div>
            )}
          </div>

          {/* Profile Views Chart */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-3">Profile views this week</div>
            <div className="flex items-end space-x-1 h-16">
              {studentProfile.profileViews.map((views, index) => (
                <div
                  key={index}
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${(views / 25) * 100}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleViewProfile}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View Profile
            </button>
            <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <Share className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </motion.div>

        {/* Application Activity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Application Activity</h3>
              <p className="text-sm text-gray-500">{applicationActivity.period}</p>
            </div>
            <button 
              onClick={handlePeriodChange}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              Change Period
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{applicationActivity.totalApplications}</div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{applicationActivity.totalInterviews}</div>
              <div className="text-sm text-gray-600">Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{applicationActivity.totalSelected}</div>
              <div className="text-sm text-gray-600">Selected</div>
            </div>
          </div>

          {/* Activity Calendar */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-3">Activity Calendar</div>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div key={`day-${index}`} className="text-center text-gray-500 font-medium py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 28 }, (_, i) => i + 1).map((date) => (
                <button
                  key={date}
                  onClick={() => handleCalendarDateClick(date)}
                  className={`text-center py-2 rounded cursor-pointer transition-all duration-200 ${getDateColor(date)}`}
                >
                  {date}
                </button>
              ))}
            </div>
            
            {/* Calendar Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span className="text-gray-600">Application Submitted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-100 rounded"></div>
                <span className="text-gray-600">Interview Scheduled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-100 rounded"></div>
                <span className="text-gray-600">Application Rejected</span>
              </div>
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded ${
                    selectedDate.type === "application" ? "bg-green-100" :
                    selectedDate.type === "interview" ? "bg-blue-100" : "bg-red-100"
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedDate.type === "application" ? "Application Submitted" :
                     selectedDate.type === "interview" ? "Interview Scheduled" : "Application Rejected"}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{selectedDate.title}</p>
                <p className="text-xs text-gray-500">{selectedDate.company}</p>
              </motion.div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Recent Activity</div>
            <div className="space-y-3">
              {applicationActivity.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.color === "green" ? "bg-green-500" :
                      activity.color === "blue" ? "bg-blue-500" : "bg-purple-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-700">{activity.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Success Insights Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Success Insights</h3>
              <p className="text-sm text-gray-500">Posted on Dec 10, 2024 - 2:30pm</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Applications Success Rate</div>
                <div className="text-2xl font-bold text-green-600">{successInsights.successRate}%</div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Interview Conversion</div>
                <div className="text-2xl font-bold text-blue-600">+{successInsights.interviewConversion}%</div>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Success Rate Trend */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-3">Success Rate Trend</div>
            <div className="flex items-end space-x-2 h-16">
              {successInsights.trendData.map((value, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-t ${
                    index < 2 ? "bg-gray-300" :
                    index === 2 ? "bg-blue-500" : "bg-green-500"
                  }`}
                  style={{ height: `${(value / 100) * 100}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Unique Finding */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="text-sm font-semibold text-blue-900 mb-2">Unique Finding</div>
            <div className="text-sm text-gray-700">{successInsights.uniqueFinding}</div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleViewDetailedAnalytics}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {showDetailedAnalytics ? "Hide Detailed Analytics" : "View Detailed Analytics"}
          </button>
        </motion.div>
      </div>

      {/* Detailed Analytics Section */}
      {showDetailedAnalytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Detailed Analytics</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Application Timeline</h4>
              <div className="space-y-4">
                {appliedInternships.map((app, index) => (
                  <div key={app.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{app.title}</h5>
                      <p className="text-sm text-gray-600">{app.company}</p>
                      <p className="text-xs text-gray-500">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === "Selected" ? "bg-green-100 text-green-800" :
                      app.status === "Interview" ? "bg-blue-100 text-blue-800" :
                      app.status === "Reviewing" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h4>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Success Rate</span>
                    <span className="text-2xl font-bold text-green-600">{successInsights.successRate}%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${successInsights.successRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Interview Conversion</span>
                    <span className="text-2xl font-bold text-blue-600">+{successInsights.interviewConversion}%</span>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Average Match Score</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {Math.round(appliedInternships.reduce((acc, app) => acc + app.match, 0) / appliedInternships.length)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Applications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {activeTab} Applications ({getFilteredApplications().length})
        </h3>
        <div className="grid gap-6">
          {getFilteredApplications().map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleApplicationClick(application.id)}
            >
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Application Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{application.title}</h3>
                      <p className="text-gray-600 mb-2">{application.company}</p>
                      <div className="flex items-center text-green-600 mb-2">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{application.match}% Match</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      application.status === "Selected" ? "bg-green-100 text-green-800" :
                      application.status === "Interview" ? "bg-blue-100 text-blue-800" :
                      application.status === "Reviewing" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {application.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm">{application.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{application.type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm font-medium">💰 {application.stipend}/month</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm">⏳ {application.duration}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Applied on: {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Progress Tracking */}
                <div className="lg:col-span-1">
                  <h4 className="font-semibold text-gray-900 mb-4">Application Progress</h4>
                  <div className="space-y-3">
                    {application.stages.map((stage, stageIndex) => (
                      <div key={stageIndex} className="flex items-center space-x-3">
                        {stage.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : stage.status === "current" ? (
                          <Clock className="w-5 h-5 text-blue-500" />
                        ) : stage.status === "rejected" || stage.status === "cancelled" ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            stage.status === "completed" ? "text-green-700" :
                            stage.status === "current" ? "text-blue-700" :
                            stage.status === "rejected" || stage.status === "cancelled" ? "text-red-700" :
                            "text-gray-500"
                          }`}>
                            {stage.name}
                          </p>
                          {stage.date && (
                            <p className="text-xs text-gray-500">
                              {new Date(stage.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplicationClick(application.id);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                {application.status === "Selected" && (
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Offer
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {getFilteredApplications().length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">No applications match the selected filter.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}