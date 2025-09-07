// src/pages/admin/AuditLogs.jsx
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
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  Shield, 
  UserCheck, 
  List, 
  Search,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  Download,
  RefreshCw,
  Activity,
  Users,
  Lock,
  Unlock,
  FileText,
  Database
} from "lucide-react";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedUser, setSelectedUser] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // table or timeline

  // Enhanced mock data
  const auditStats = [
    {
      title: "Total Events",
      value: 1247,
      change: "+15%",
      changeType: "positive",
      icon: <List className="w-8 h-8 text-blue-600" />,
      color: "blue"
    },
    {
      title: "Security Events",
      value: 23,
      change: "-5%",
      changeType: "negative",
      icon: <Shield className="w-8 h-8 text-red-600" />,
      color: "red"
    },
    {
      title: "User Actions",
      value: 892,
      change: "+12%",
      changeType: "positive",
      icon: <UserCheck className="w-8 h-8 text-green-600" />,
      color: "green"
    },
    {
      title: "System Events",
      value: 332,
      change: "+8%",
      changeType: "positive",
      icon: <Database className="w-8 h-8 text-purple-600" />,
      color: "purple"
    }
  ];

  const activityTrends = [
    { hour: "00:00", events: 12, security: 2, users: 8, system: 2 },
    { hour: "04:00", events: 8, security: 1, users: 5, system: 2 },
    { hour: "08:00", events: 45, security: 3, users: 35, system: 7 },
    { hour: "12:00", events: 78, security: 5, users: 60, system: 13 },
    { hour: "16:00", events: 65, security: 4, users: 50, system: 11 },
    { hour: "20:00", events: 32, security: 2, users: 25, system: 5 }
  ];

  const eventCategories = [
    { category: "User Login", count: 245, color: "#3B82F6" },
    { category: "Data Access", count: 189, color: "#10B981" },
    { category: "System Changes", count: 156, color: "#F59E0B" },
    { category: "Failed Login", count: 23, color: "#EF4444" },
    { category: "Permission Changes", count: 12, color: "#8B5CF6" },
    { category: "Data Export", count: 8, color: "#06B6D4" }
  ];

  // Simulated API call
  useEffect(() => {
    setTimeout(() => {
      setLogs([
        {
          id: 1,
          event: "User Login",
          category: "User Action",
          time: "2024-01-15 10:12:34",
          user: "admin_01",
          ip: "192.168.1.100",
          location: "Mumbai, India",
          status: "Success",
          details: "Successful login from office network"
        },
        {
          id: 2,
          event: "Internship Created",
          category: "System Event",
          time: "2024-01-15 09:45:12",
          user: "admin_01",
          ip: "192.168.1.100",
          location: "Mumbai, India",
          status: "Success",
          details: "New internship listing created for TechCorp India"
        },
        {
          id: 3,
          event: "Failed Login Attempt",
          category: "Security Event",
          time: "2024-01-15 08:20:45",
          user: "unknown",
          ip: "203.45.67.89",
          location: "Unknown",
          status: "Failed",
          details: "Multiple failed login attempts detected"
        },
        {
          id: 4,
          event: "Data Export",
          category: "System Event",
          time: "2024-01-15 07:30:22",
          user: "admin_02",
          ip: "192.168.1.101",
          location: "Delhi, India",
          status: "Success",
          details: "Monthly report exported to Excel format"
        },
        {
          id: 5,
          event: "Permission Updated",
          category: "Security Event",
          time: "2024-01-15 06:15:33",
          user: "admin_01",
          ip: "192.168.1.100",
          location: "Mumbai, India",
          status: "Success",
          details: "User permissions updated for student_123"
        },
        {
          id: 6,
          event: "System Backup",
          category: "System Event",
          time: "2024-01-15 05:00:00",
          user: "system",
          ip: "127.0.0.1",
          location: "Local",
          status: "Success",
          details: "Automated daily backup completed successfully"
        }
      ]);
    }, 1000);
  }, []);

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    return (
      (category === "All" || log.category === category) &&
      (selectedUser === "All" || log.user === selectedUser) &&
      log.event.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getEventIcon = (category) => {
    switch (category) {
      case "User Action": return <UserCheck className="w-4 h-4 text-green-500" />;
      case "Security Event": return <Shield className="w-4 h-4 text-red-500" />;
      case "System Event": return <Database className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Failed": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "Warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Success": return "bg-green-100 text-green-700";
      case "Failed": return "bg-red-100 text-red-700";
      case "Warning": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "User Action": return "bg-green-100 text-green-700";
      case "Security Event": return "bg-red-100 text-red-700";
      case "System Event": return "bg-blue-100 text-blue-700";
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
        className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Audit Logs</h1>
            <p className="text-red-100 text-lg">
              Track and analyze all system activities, user actions, and security events
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{auditStats[0].value.toLocaleString()}</div>
                <div className="text-red-200 text-sm">Total Events</div>
              </div>
              <div className="w-px h-12 bg-red-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">{auditStats[1].value}</div>
                <div className="text-red-200 text-sm">Security Events</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Audit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {auditStats.map((stat, index) => (
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
                  <Activity className={`w-4 h-4 ${stat.changeType === 'negative' ? 'rotate-180' : ''}`} />
                  {stat.change} from last 24h
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'red' ? 'bg-red-100' :
                stat.color === 'green' ? 'bg-green-100' :
                'bg-purple-100'
              }`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Activity Trends (Last 24 Hours)</h3>
            <p className="text-gray-500 text-sm">Real-time event monitoring</p>
          </div>
          <Activity className="w-6 h-6 text-blue-500" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={activityTrends}>
            <defs>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSecurity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="events" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorEvents)" 
            />
            <Area 
              type="monotone" 
              dataKey="security" 
              stroke="#EF4444" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSecurity)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Total Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Security Events</span>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              <option value="User Action">User Action</option>
              <option value="System Event">System Event</option>
              <option value="Security Event">Security Event</option>
            </select>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="All">All Users</option>
              <option value="admin_01">admin_01</option>
              <option value="admin_02">admin_02</option>
              <option value="system">system</option>
              <option value="unknown">unknown</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(viewMode === "table" ? "timeline" : "table")}
              className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              {viewMode === "table" ? <Clock className="w-5 h-5" /> : <List className="w-5 h-5" />}
              {viewMode === "table" ? "Timeline View" : "Table View"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Logs
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Event Categories Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Event Categories</h3>
            <p className="text-gray-500 text-sm">Distribution of events by type</p>
          </div>
          <Filter className="w-6 h-6 text-purple-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventCategories.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">{event.category}</span>
                <span className="text-gray-800 font-bold">{event.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(event.count / Math.max(...eventCategories.map(e => e.count))) * 100}%` }}
                  transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                  className="h-2 rounded-full"
                  style={{ backgroundColor: event.color }}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Audit Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Audit Logs</h3>
              <p className="text-gray-500 text-sm">Detailed event log with filtering</p>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredLogs.length} of {logs.length} events
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Event</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">IP Address</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getEventIcon(log.category)}
                      <div>
                        <div className="font-medium text-gray-800">{log.event}</div>
                        <div className="text-sm text-gray-500">{log.details}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{log.user}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-gray-800">{log.ip}</div>
                      <div className="text-sm text-gray-500">{log.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{log.time}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}