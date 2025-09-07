import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Award,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
  Zap,
  Globe
} from "lucide-react";

export default function Overview() {
  // Mock data (later replace with API calls)
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeInternships: 0,
    applicationsThisMonth: 0,
    successRate: 0,
  });

  const [engagementData, setEngagementData] = useState([]);
  const [skillsGap, setSkillsGap] = useState([]);
  const [activities, setActivities] = useState([]);
  const [regionalData, setRegionalData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalStudents: 12340,
        activeInternships: 320,
        applicationsThisMonth: 870,
        successRate: 78,
      });

      setEngagementData([
        { month: "Jan", students: 400, applications: 1200 },
        { month: "Feb", students: 600, applications: 1800 },
        { month: "Mar", students: 800, applications: 2400 },
        { month: "Apr", students: 1200, applications: 3600 },
        { month: "May", students: 900, applications: 2700 },
        { month: "Jun", students: 1100, applications: 3300 },
      ]);

      setSkillsGap([
        { skill: "React", percentage: 82, demand: "High", color: "#3B82F6" },
        { skill: "Node.js", percentage: 74, demand: "High", color: "#10B981" },
        { skill: "Python", percentage: 65, demand: "Medium", color: "#F59E0B" },
        { skill: "Machine Learning", percentage: 58, demand: "High", color: "#8B5CF6" },
        { skill: "Communication", percentage: 91, demand: "Critical", color: "#EF4444" },
        { skill: "Data Analysis", percentage: 67, demand: "Medium", color: "#06B6D4" },
      ]);

      setActivities([
        { id: 1, type: "success", message: "20 new students registered today", time: "2 min ago" },
        { id: 2, type: "warning", message: "5 internships pending approval", time: "15 min ago" },
        { id: 3, type: "info", message: "12 applications reviewed", time: "1 hour ago" },
        { id: 4, type: "success", message: "Server sync completed", time: "2 hours ago" },
        { id: 5, type: "info", message: "Monthly report generated", time: "3 hours ago" },
      ]);

      setRegionalData([
        { state: "Maharashtra", students: 3200, internships: 85, color: "#3B82F6" },
        { state: "Karnataka", students: 2800, internships: 72, color: "#10B981" },
        { state: "Tamil Nadu", students: 2100, internships: 58, color: "#F59E0B" },
        { state: "Delhi", students: 1900, internships: 45, color: "#8B5CF6" },
        { state: "Gujarat", students: 1500, internships: 38, color: "#EF4444" },
        { state: "Others", students: 1840, internships: 22, color: "#06B6D4" },
      ]);

      setCategoryData([
        { name: "Technology", value: 35, color: "#3B82F6" },
        { name: "Government", value: 25, color: "#10B981" },
        { name: "Healthcare", value: 15, color: "#F59E0B" },
        { name: "Education", value: 12, color: "#8B5CF6" },
        { name: "Finance", value: 8, color: "#EF4444" },
        { name: "Others", value: 5, color: "#06B6D4" },
      ]);

      setTrendData([
        { month: "Jan", applications: 1200, matches: 800 },
        { month: "Feb", applications: 1800, matches: 1200 },
        { month: "Mar", applications: 2400, matches: 1600 },
        { month: "Apr", applications: 3600, matches: 2400 },
        { month: "May", applications: 2700, matches: 1800 },
        { month: "Jun", applications: 3300, matches: 2200 },
      ]);
    }, 1000);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "info": return <Activity className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Monitor PM Internship Scheme performance across India
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-4">
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

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Internships</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.activeInternships}</p>
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Applications This Month</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.applicationsThisMonth}</p>
              <p className="text-blue-600 text-sm mt-1 flex items-center gap-1">
                <Activity className="w-4 h-4" />
                +15% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Success Rate</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.successRate}%</p>
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <Award className="w-4 h-4" />
                +3% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Engagement Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Student Engagement</h3>
              <p className="text-gray-500 text-sm">Monthly registration trends</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Students</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="students" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorStudents)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skills Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">AI Skills Gap Analysis</h3>
              <p className="text-gray-500 text-sm">Current skill proficiency levels</p>
            </div>
            <Zap className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {skillsGap.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-bold">{skill.percentage}%</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      skill.demand === 'Critical' ? 'bg-red-100 text-red-700' :
                      skill.demand === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {skill.demand}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.percentage}%` }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    className="h-3 rounded-full"
                    style={{ backgroundColor: skill.color }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Regional Distribution & Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regional Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Regional Distribution</h3>
              <p className="text-gray-500 text-sm">Students by state</p>
            </div>
            <MapPin className="w-6 h-6 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="state" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                {regionalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Internship Categories</h3>
              <p className="text-gray-500 text-sm">Distribution by sector</p>
            </div>
            <Globe className="w-6 h-6 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
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
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
              <p className="text-gray-500 text-sm">Latest system updates</p>
            </div>
            <Clock className="w-6 h-6 text-gray-500" />
          </div>
          <div className="space-y-4">
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 + activity.id * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-gray-800 text-sm">{activity.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
              <p className="text-gray-500 text-sm">Common administrative tasks</p>
            </div>
            <Zap className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              <Briefcase className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Add New Internship</div>
                <div className="text-blue-100 text-sm">Create internship listing</div>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              <Users className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Review Applications</div>
                <div className="text-green-100 text-sm">Process pending applications</div>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
            >
              <Target className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Generate Reports</div>
                <div className="text-purple-100 text-sm">Export analytics data</div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
