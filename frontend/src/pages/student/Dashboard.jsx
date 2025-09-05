// src/pages/student/Dashboard.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Briefcase, FileText, Bell, Settings, Bot, Brain, 
  TrendingUp, MapPin, Star, ArrowRight, RefreshCw 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      icon: <Brain size={30} />,
      path: "recommendation",
      color: "from-blue-500 to-indigo-600",
      badge: "New"
    },
    {
      name: "My Profile",
      desc: "View and edit your personal details",
      icon: <User size={30} />,
      path: "profile",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Applications",
      desc: "Track your internship applications",
      icon: <FileText size={30} />,
      path: "applications",
      color: "from-purple-500 to-pink-600",
    },
    {
      name: "AI Mentor",
      desc: "Chat with your career assistant",
      icon: <Bot size={30} />,
      path: "chatbot",
      color: "from-orange-500 to-red-600",
    },
    {
      name: "Notifications",
      desc: "Stay updated with latest alerts",
      icon: <Bell size={30} />,
      path: "notifications",
      color: "from-yellow-500 to-orange-600",
    },
    {
      name: "Settings",
      desc: "Manage your preferences",
      icon: <Settings size={30} />,
      path: "progress",
      color: "from-gray-600 to-gray-900",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome back, {userStats.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Your AI-powered internship journey dashboard
            </p>
          </div>
          <button
            onClick={handleRefreshRecommendations}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh AI
          </button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Profile Completion</p>
              <p className="text-2xl font-bold text-blue-600">{userStats.profileCompletion}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${userStats.profileCompletion}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">AI Matches</p>
              <p className="text-2xl font-bold text-green-600">{userStats.matches}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Personalized recommendations</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Applications</p>
              <p className="text-2xl font-bold text-purple-600">{userStats.applications}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Active applications</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Saved</p>
              <p className="text-2xl font-bold text-orange-600">{userStats.savedInternships}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
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
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-blue-600" />
            Recent AI Recommendations
          </h2>
          <button
            onClick={() => navigate("recommendation")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentRecommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(`/internship-details/${rec.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                  <p className="text-sm text-gray-600">{rec.company}</p>
                </div>
                <div className="flex items-center text-green-600">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{rec.match}%</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-sm">{rec.location}</span>
                </div>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {rec.type}
                </span>
              </div>

              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              onClick={() => navigate(action.path)}
              className="cursor-pointer bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition transform duration-300 ease-in-out group border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r ${action.color} text-white shadow-md group-hover:scale-110 transition`}
                >
                  {action.icon}
                </div>
                {action.badge && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    {action.badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition">
                {action.name}
              </h3>
              <p className="text-gray-600 text-sm">{action.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

