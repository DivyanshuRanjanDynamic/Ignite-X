// src/pages/admin/UserManagement.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  TrendingUp,
  Eye,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  UserCheck,
  UserX,
  Settings,
  Bell,
  Lock,
  Unlock,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Info,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Target,
  Globe,
  Zap,
  Database
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table"); // table, grid, analytics

  // Enhanced user statistics
  const userStats = [
    {
      title: "Total Users",
      value: 1247,
      change: "+15%",
      changeType: "positive",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      color: "blue"
    },
    {
      title: "Active Users",
      value: 1089,
      change: "+12%",
      changeType: "positive",
      icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
      color: "green"
    },
    {
      title: "Admins",
      value: 23,
      change: "+2",
      changeType: "positive",
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      color: "purple"
    },
    {
      title: "Suspended",
      value: 15,
      change: "-3",
      changeType: "negative",
      icon: <Info className="w-8 h-8 text-red-600" />,
      color: "red"
    }
  ];

  const userActivityData = [
    { month: "Jan", newUsers: 120, activeUsers: 980 },
    { month: "Feb", newUsers: 150, activeUsers: 1020 },
    { month: "Mar", newUsers: 180, activeUsers: 1080 },
    { month: "Apr", newUsers: 200, activeUsers: 1120 },
    { month: "May", newUsers: 160, activeUsers: 1100 },
    { month: "Jun", newUsers: 190, activeUsers: 1089 }
  ];

  const roleDistribution = [
    { role: "Students", count: 1150, color: "#3B82F6" },
    { role: "Admins", count: 23, color: "#8B5CF6" },
    { role: "Recruiters", count: 45, color: "#10B981" },
    { role: "Moderators", count: 12, color: "#F59E0B" },
    { role: "Support", count: 17, color: "#EF4444" }
  ];

  // Advanced User Analytics
  const userEngagementData = [
    { month: "Jan", activeUsers: 980, newRegistrations: 120, avgSessionTime: 15.2 },
    { month: "Feb", activeUsers: 1020, newRegistrations: 150, avgSessionTime: 16.8 },
    { month: "Mar", activeUsers: 1080, newRegistrations: 180, avgSessionTime: 18.5 },
    { month: "Apr", activeUsers: 1120, newRegistrations: 200, avgSessionTime: 19.2 },
    { month: "May", activeUsers: 1100, newRegistrations: 160, avgSessionTime: 17.8 },
    { month: "Jun", activeUsers: 1089, newRegistrations: 190, avgSessionTime: 20.1 }
  ];

  // User Behavior Analytics
  const userBehaviorMetrics = [
    { metric: "Profile Completion Rate", value: 87, trend: "up", color: "#3B82F6" },
    { metric: "Application Success Rate", value: 72, trend: "up", color: "#10B981" },
    { metric: "AI Recommendation Usage", value: 94, trend: "up", color: "#F59E0B" },
    { metric: "Platform Retention Rate", value: 78, trend: "stable", color: "#8B5CF6" }
  ];

  // Geographic Distribution
  const geographicData = [
    { state: "Maharashtra", users: 320, growth: 12, color: "#3B82F6" },
    { state: "Karnataka", users: 280, growth: 15, color: "#10B981" },
    { state: "Tamil Nadu", users: 210, growth: 8, color: "#F59E0B" },
    { state: "Delhi", users: 190, growth: 18, color: "#8B5CF6" },
    { state: "Gujarat", users: 150, growth: 10, color: "#EF4444" }
  ];

  // User Activity Patterns
  const activityPatterns = [
    { time: "00:00", activity: 15 },
    { time: "04:00", activity: 8 },
    { time: "08:00", activity: 45 },
    { time: "12:00", activity: 78 },
    { time: "16:00", activity: 92 },
    { time: "20:00", activity: 65 }
  ];

  // Simulated API call
  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          name: "Ravi Kumar",
          email: "ravi.kumar@example.com",
          role: "Student",
          status: "Active",
          joinDate: "2024-01-15",
          lastActive: "2024-01-15 10:30:00",
          location: "Mumbai, Maharashtra",
          phone: "+91 98765 43210",
          applications: 5,
          profile: {
            education: "B.Tech Computer Science",
            skills: ["React", "Node.js", "Python"],
            experience: "1 year"
          }
        },
        {
          id: 2,
          name: "Ananya Singh",
          email: "ananya.singh@example.com",
          role: "Admin",
          status: "Active",
          joinDate: "2023-12-01",
          lastActive: "2024-01-15 09:45:00",
          location: "New Delhi",
          phone: "+91 98765 43211",
          applications: 0,
          profile: {
            education: "M.Tech Information Technology",
            skills: ["System Administration", "Database Management"],
            experience: "5 years"
          }
        },
        {
          id: 3,
          name: "Amit Sharma",
          email: "amit.sharma@example.com",
          role: "Student",
          status: "Suspended",
          joinDate: "2024-01-10",
          lastActive: "2024-01-14 15:20:00",
          location: "Bangalore, Karnataka",
          phone: "+91 98765 43212",
          applications: 2,
          profile: {
            education: "B.E. Electronics",
            skills: ["Java", "Spring Boot", "MySQL"],
            experience: "2 years"
          }
        },
        {
          id: 4,
          name: "Priya Das",
          email: "priya.das@example.com",
          role: "Recruiter",
          status: "Active",
          joinDate: "2023-11-20",
          lastActive: "2024-01-15 08:15:00",
          location: "Chennai, Tamil Nadu",
          phone: "+91 98765 43213",
          applications: 0,
          profile: {
            education: "MBA Human Resources",
            skills: ["Talent Acquisition", "HR Management"],
            experience: "8 years"
          }
        },
        {
          id: 5,
          name: "Suresh Patel",
          email: "suresh.patel@example.com",
          role: "Student",
          status: "Active",
          joinDate: "2024-01-05",
          lastActive: "2024-01-15 11:00:00",
          location: "Ahmedabad, Gujarat",
          phone: "+91 98765 43214",
          applications: 3,
          profile: {
            education: "B.Sc. Computer Science",
            skills: ["JavaScript", "React", "MongoDB"],
            experience: "1 year"
          }
        }
      ]);
    }, 1000);
  }, []);

  // Filtered users
  const filteredUsers = users.filter((user) => {
    return (
      (roleFilter === "All" || user.role === roleFilter) &&
      (statusFilter === "All" || user.status === statusFilter) &&
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Suspended": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "Pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Suspended": return "bg-red-100 text-red-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin": return "bg-purple-100 text-purple-700";
      case "Student": return "bg-blue-100 text-blue-700";
      case "Recruiter": return "bg-green-100 text-green-700";
      case "Moderator": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleUserAction = (action, userId) => {
    console.log(`${action} user ${userId}`);
    // Implement user actions here
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedUsers.length > 0) {
      console.log(`Bulk ${bulkAction} for users:`, selectedUsers);
      alert(`✅ Bulk ${bulkAction} applied to ${selectedUsers.length} users`);
      setSelectedUsers([]);
      setBulkAction("");
      setShowBulkActions(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down": return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Advanced Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Advanced User Management</h1>
              <p className="text-indigo-100 text-lg">
                Comprehensive user analytics, behavior insights, and advanced management tools
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats[0].value.toLocaleString()}</div>
                  <div className="text-indigo-200 text-sm">Total Users</div>
                </div>
                <div className="w-px h-12 bg-indigo-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats[1].value.toLocaleString()}</div>
                  <div className="text-indigo-200 text-sm">Active Users</div>
                </div>
                <div className="w-px h-12 bg-indigo-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats[2].value}</div>
                  <div className="text-indigo-200 text-sm">Admins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value.toLocaleString()}</p>
                <p className={`text-sm mt-1 flex items-center gap-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${stat.changeType === 'negative' ? 'rotate-180' : ''}`} />
                  {stat.change} from last month
          </p>
        </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'purple' ? 'bg-purple-100' :
                'bg-red-100'
              }`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced User Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Engagement Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">User Engagement Trends</h3>
              <p className="text-gray-500 text-sm">Monthly engagement and session analytics</p>
            </div>
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userEngagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar yAxisId="left" dataKey="activeUsers" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="newRegistrations" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="avgSessionTime" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New Registrations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Avg Session (min)</span>
            </div>
          </div>
        </motion.div>

        {/* User Behavior Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">User Behavior Metrics</h3>
              <p className="text-gray-500 text-sm">Key performance indicators</p>
            </div>
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-4">
            {userBehaviorMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium text-sm">{metric.metric}</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className="text-green-600 text-xs font-medium">{metric.trend}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">{metric.value}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </div>

      {/* Geographic Distribution & Activity Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Geographic Distribution</h3>
              <p className="text-gray-500 text-sm">User distribution by state</p>
            </div>
            <Globe className="w-6 h-6 text-purple-500" />
          </div>
          <div className="space-y-4">
            {geographicData.map((state, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                className="p-4 border border-gray-100 rounded-xl"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{state.state}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">+{state.growth}%</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">{state.users} users</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(state.users / 320) * 100}%` }}
                    transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: state.color }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Patterns */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Activity Patterns</h3>
              <p className="text-gray-500 text-sm">Peak usage times throughout the day</p>
            </div>
            <Activity className="w-6 h-6 text-orange-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityPatterns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="activity" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-500">Peak activity: 4:00 PM (92 users)</div>
        </div>
        </motion.div>
      </div>

      {/* Role Distribution & Advanced Search/Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Role Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Role Distribution</h3>
              <p className="text-gray-500 text-sm">Users by role</p>
            </div>
            <Users className="w-6 h-6 text-purple-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {roleDistribution.map((role, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: role.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{role.role}</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{role.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Advanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Advanced Search & Filter</h3>
              <p className="text-gray-500 text-sm">Find and manage users with advanced tools</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-6 h-6 text-indigo-500" />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg ${viewMode === "table" ? "bg-indigo-100 text-indigo-600" : "text-gray-400"}`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("analytics")}
                  className={`p-2 rounded-lg ${viewMode === "analytics" ? "bg-indigo-100 text-indigo-600" : "text-gray-400"}`}
                >
                  <PieChartIcon className="w-4 h-4" />
          </button>
              </div>
            </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
            </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="joinDate">Sort by Join Date</option>
              <option value="lastActive">Sort by Last Active</option>
              <option value="applications">Sort by Applications</option>
          </select>
        </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Add New User
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Users
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Bulk Actions
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              <Bell className="w-5 h-5" />
              Notify Users
            </motion.button>
          </div>

          {/* Bulk Actions Panel */}
          {showBulkActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {selectedUsers.length} users selected
                </span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Action</option>
                  <option value="activate">Activate Users</option>
                  <option value="suspend">Suspend Users</option>
                  <option value="send-email">Send Email</option>
                  <option value="export">Export Selected</option>
                  <option value="delete">Delete Users</option>
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkAction}
                  disabled={!bulkAction || selectedUsers.length === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Apply Action
                </motion.button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Advanced Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Advanced User Management</h3>
              <p className="text-gray-500 text-sm">Comprehensive user management with bulk operations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-2 py-1 border border-gray-200 rounded text-sm"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-indigo-600"
                    onClick={() => handleSort("name")}>
                  User {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-indigo-600"
                    onClick={() => handleSort("role")}>
                  Role {sortBy === "role" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-indigo-600"
                    onClick={() => handleSort("status")}>
                  Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-indigo-600"
                    onClick={() => handleSort("lastActive")}>
                  Last Active {sortBy === "lastActive" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-indigo-600"
                    onClick={() => handleSort("applications")}>
                  Applications {sortBy === "applications" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedUsers.includes(user.id) ? 'bg-indigo-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.location}</td>
                  <td className="px-6 py-4 text-gray-600">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-800">{user.applications}</span>
                      {user.applications > 0 && (
                        <span className="text-xs text-green-600 bg-green-100 px-1 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openUserModal(user)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUserAction('edit', user.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUserAction('suspend', user.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                        title="Suspend User"
                      >
                        <ShieldX className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUserAction('delete', user.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUserModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedUser.name}</h4>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                      {getStatusIcon(selectedUser.status)}
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selectedUser.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Joined: {selectedUser.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Last Active: {selectedUser.lastActive}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Education</h5>
                    <p className="text-gray-600 text-sm">{selectedUser.profile.education}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Experience</h5>
                    <p className="text-gray-600 text-sm">{selectedUser.profile.experience}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedUser.profile.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Edit User
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Send Message
                </motion.button>
        </div>
      </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}