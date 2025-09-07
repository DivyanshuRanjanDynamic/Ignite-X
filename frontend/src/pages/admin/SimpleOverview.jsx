// src/pages/admin/SimpleOverview.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Award,
  CheckCircle,
  AlertCircle,
  Activity
} from "lucide-react";

export default function SimpleOverview() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const [stats, setStats] = useState({
    totalStudents: 0,
    activeInternships: 0,
    applicationsThisMonth: 0,
    successRate: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [applicationTrends, setApplicationTrends] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalStudents: 1247,
        activeInternships: 89,
        applicationsThisMonth: 342,
        successRate: 78,
      });

      setApplicationTrends([
        { month: "Jan", applications: 120, selected: 85 },
        { month: "Feb", applications: 180, selected: 125 },
        { month: "Mar", applications: 240, selected: 180 },
        { month: "Apr", applications: 320, selected: 250 },
        { month: "May", applications: 280, selected: 220 },
        { month: "Jun", applications: 342, selected: 267 }
      ]);

      setRecentActivity([
        { id: 1, user: "Ravi Kumar", action: "Applied for Software Developer Internship", time: "2 hours ago", type: "application" },
        { id: 2, user: "Priya Singh", action: "Profile completed", time: "4 hours ago", type: "profile" },
        { id: 3, user: "Amit Sharma", action: "Selected for Data Science Internship", time: "6 hours ago", type: "selection" },
        { id: 4, user: "Ananya Das", action: "New user registered", time: "8 hours ago", type: "registration" },
        { id: 5, user: "Suresh Patel", action: "Applied for Marketing Internship", time: "10 hours ago", type: "application" }
      ]);
    }, 1000);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "application": return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "selection": return <Award className="w-4 h-4 text-green-500" />;
      case "profile": return <Users className="w-4 h-4 text-purple-500" />;
      case "registration": return <CheckCircle className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "application": return "bg-blue-100 text-blue-700";
      case "selection": return "bg-green-100 text-green-700";
      case "profile": return "bg-purple-100 text-purple-700";
      case "registration": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 text-sm md:text-base lg:text-lg">
              PM Internship Scheme - Key Metrics & Overview
            </p>
          </div>
          <div className="flex lg:hidden">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center bg-blue-700/30 rounded-lg p-3">
                <div className="text-lg md:text-xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-blue-200 text-xs md:text-sm">Students</div>
              </div>
              <div className="text-center bg-blue-700/30 rounded-lg p-3">
                <div className="text-lg md:text-xl font-bold">{stats.activeInternships}</div>
                <div className="text-blue-200 text-xs md:text-sm">Active</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-blue-200 text-sm">Total Students</div>
              </div>
              <div className="w-px h-12 bg-blue-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.activeInternships}</div>
                <div className="text-blue-200 text-sm">Active Internships</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs lg:text-sm font-medium">Total Students</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-green-600 text-xs lg:text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">+15% from last month</span>
                <span className="sm:hidden">+15%</span>
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs lg:text-sm font-medium">Active Internships</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{stats.activeInternships}</p>
              <p className="text-green-600 text-xs lg:text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">+8% from last month</span>
                <span className="sm:hidden">+8%</span>
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs lg:text-sm font-medium">Applications This Month</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{stats.applicationsThisMonth}</p>
              <p className="text-green-600 text-xs lg:text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">+22% from last month</span>
                <span className="sm:hidden">+22%</span>
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Award className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs lg:text-sm font-medium">Success Rate</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{stats.successRate}%</p>
              <p className="text-green-600 text-xs lg:text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                +5% from last month
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Application Trends</h3>
              <p className="text-gray-500 text-sm">Monthly applications and selections</p>
            </div>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="selected" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
              <p className="text-gray-500 text-sm">Latest platform activities</p>
            </div>
            <Activity className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + activity.id * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{activity.user}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{activity.action}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
            <p className="text-gray-500 text-sm">Common administrative tasks</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Briefcase className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-800">Add New Internship</div>
              <div className="text-sm text-gray-500">Create internship listing</div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
          >
            <Users className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-800">Manage Users</div>
              <div className="text-sm text-gray-500">View and edit users</div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
          >
            <Award className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-800">View Applications</div>
              <div className="text-sm text-gray-500">Review applications</div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}