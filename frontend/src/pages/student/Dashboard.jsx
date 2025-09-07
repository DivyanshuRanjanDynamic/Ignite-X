// src/pages/student/Dashboard.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Briefcase, FileText, Bell, Settings, Bot, Brain, 
  TrendingUp, MapPin, Star, ArrowRight, RefreshCw 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Mock user data - in real app, this would come from API
  const userStats = {
    name: "Rohan",
    profileCompletion: 85,
    applications: 3,
    matches: 5,
    savedInternships: 8
  };

  // Mock recent recommendations
  const recentRecommendations = [
    {
      id: 1,
      title: "Digital India Intern",
      company: "Ministry of Electronics & IT",
      match: 95,
      location: "Remote",
      type: "Government"
    },
    {
      id: 2,
      title: "Rural Development Intern", 
      company: "Ministry of Rural Development",
      match: 92,
      location: "Delhi",
      type: "Social Impact"
    },
    {
      id: 3,
      title: "Skill Development Intern",
      company: "Ministry of Skill Development", 
      match: 88,
      location: "Mumbai",
      type: "Education"
    }
  ];

  const handleRefreshRecommendations = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const actions = [
    {
      name: "AI Recommendations",
      desc: "Get personalized internship suggestions",
      icon: <Brain className="w-6 h-6 sm:w-7 sm:h-7" />,
      path: "recommendation",
      color: "from-blue-500 to-indigo-600",
      badge: "New"
    },
    {
      name: "My Profile",
      desc: "View and edit your personal details",
      icon: <User className="w-6 h-6 sm:w-7 sm:h-7" />,
      path: "profile",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Applications",
      desc: "Track your internship applications",
      icon: <FileText className="w-6 h-6 sm:w-7 sm:h-7" />,
      path: "applications",
      color: "from-purple-500 to-pink-600",
    },
    {
      name: "AI Mentor",
      desc: "Chat with your career assistant",
      icon: <Bot className="w-6 h-6 sm:w-7 sm:h-7" />,
      path: "chatbot",
      color: "from-orange-500 to-red-600",
    },
    {
      name: "Notifications",
      desc: "Stay updated with latest alerts",
      icon: <Bell className="w-6 h-6 sm:w-7 sm:h-7" />,
      path: "notifications",
      color: "from-yellow-500 to-orange-600",
    },
    {
      name: "Settings",
      desc: "Manage your preferences",
      icon: <Settings className="w-6 h-6 sm:w-7 sm:h-7" />,
      path: "progress",
      color: "from-gray-600 to-gray-900",
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Welcome back, {userStats.name}! 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Your AI-powered internship journey dashboard
            </p>
          </div>
          <button
            onClick={handleRefreshRecommendations}
            disabled={isRefreshing}
            className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm sm:text-base">Refresh AI</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Profile Completion</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{userStats.profileCompletion}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-500"
              style={{ width: `${userStats.profileCompletion}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">AI Matches</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{userStats.matches}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Personalized recommendations</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Applications</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{userStats.applications}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Active applications</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Saved</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{userStats.savedInternships}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Bookmarked internships</p>
        </div>
      </motion.div>

      {/* Recent AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
            Recent AI Recommendations
          </h2>
          <button
            onClick={() => navigate("recommendation")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition text-sm sm:text-base self-start sm:self-auto"
          >
            View All
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {recentRecommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(`/internship/${rec.id}`)}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 pr-2">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2">{rec.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{rec.company}</p>
                </div>
                <div className="flex items-center text-green-600 flex-shrink-0">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm font-medium">{rec.match}%</span>
                </div>
              </div>

              <div className="space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-red-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm line-clamp-1">{rec.location}</span>
                </div>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {rec.type}
                </span>
              </div>

              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm font-medium">
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {actions.map((action, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              onClick={() => navigate(action.path)}
              className="cursor-pointer bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-2xl hover:scale-[1.02] transition transform duration-300 ease-in-out group border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-gradient-to-r ${action.color} text-white shadow-md group-hover:scale-110 transition`}
                >
                  {action.icon}
                </div>
                {action.badge && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    {action.badge}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition line-clamp-2">
                {action.name}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{action.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

