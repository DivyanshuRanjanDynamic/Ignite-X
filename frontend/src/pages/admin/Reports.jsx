// src/pages/admin/Reports.jsx
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
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ComposedChart
} from "recharts";
import { 
  FileText, 
  Clock, 
  Download, 
  TrendingUp,
  Users,
  Briefcase,
  Target,
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,

  Database,
  Globe,
  Zap,
  Activity,
  TrendingDown,
  Eye,
  Share2,
  Settings,
  Bell
} from "lucide-react";

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("monthly");
  const [selectedTimeRange, setSelectedTimeRange] = useState("6months");
  const [reports, setReports] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(["applications", "success"]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Advanced report statistics with unique insights
  const reportStats = [
    {
      title: "AI Recommendations Generated",
      value: 2847,
      change: "+34%",
      changeType: "positive",
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      color: "blue",
      description: "AI-powered suggestions this month"
    },
    {
      title: "Data Quality Score",
      value: 94.2,
      change: "+2.1%",
      changeType: "positive",
      icon: <Database className="w-8 h-8 text-green-600" />,
      color: "green",
      description: "Overall data accuracy"
    },
    {
      title: "Real-time Syncs",
      value: 1247,
      change: "+18%",
      changeType: "positive",
      icon: <Database className="w-8 h-8 text-purple-600" />,
      color: "purple",
      description: "PM Portal integrations"
    },
    {
      title: "Geographic Coverage",
      value: 28,
      change: "+3",
      changeType: "positive",
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      color: "orange",
      description: "States/UTs covered"
    }
  ];

  // Advanced AI Performance Metrics
  const aiPerformanceData = [
    { month: "Jan", accuracy: 78, recommendations: 1200, userSatisfaction: 82 },
    { month: "Feb", accuracy: 81, recommendations: 1800, userSatisfaction: 85 },
    { month: "Mar", accuracy: 84, recommendations: 2400, userSatisfaction: 87 },
    { month: "Apr", accuracy: 87, recommendations: 3600, userSatisfaction: 89 },
    { month: "May", accuracy: 89, recommendations: 2700, userSatisfaction: 91 },
    { month: "Jun", accuracy: 92, recommendations: 3300, userSatisfaction: 93 }
  ];

  // Predictive Analytics Data
  const predictiveInsights = [
    { metric: "Next Month Applications", predicted: 4200, confidence: 89, trend: "up" },
    { metric: "Skill Gap Reduction", predicted: 15, confidence: 76, trend: "up" },
    { metric: "Regional Expansion", predicted: 3, confidence: 82, trend: "up" },
    { metric: "AI Accuracy Improvement", predicted: 94, confidence: 91, trend: "up" }
  ];

  // Data Quality Metrics
  const dataQualityMetrics = [
    { source: "PM Portal API", completeness: 98, accuracy: 96, freshness: 95, color: "#3B82F6" },
    { source: "User Profiles", completeness: 87, accuracy: 92, freshness: 88, color: "#10B981" },
    { source: "Internship Data", completeness: 94, accuracy: 89, freshness: 92, color: "#F59E0B" },
    { source: "Skills Database", completeness: 91, accuracy: 94, freshness: 90, color: "#8B5CF6" }
  ];

  // Advanced Analytics - Conversion Funnel
  const conversionFunnel = [
    { stage: "Portal Visits", count: 15000, percentage: 100, color: "#3B82F6" },
    { stage: "Profile Creation", count: 12000, percentage: 80, color: "#10B981" },
    { stage: "AI Recommendations", count: 9500, percentage: 63, color: "#F59E0B" },
    { stage: "Applications", count: 7200, percentage: 48, color: "#8B5CF6" },
    { stage: "Selections", count: 1800, percentage: 12, color: "#EF4444" }
  ];

  // Real-time System Health
  const systemHealth = [
    { component: "AI Engine", status: "healthy", uptime: 99.9, responseTime: 120 },
    { component: "Database", status: "healthy", uptime: 99.8, responseTime: 45 },
    { component: "API Gateway", status: "warning", uptime: 98.5, responseTime: 200 },
    { component: "PM Portal Sync", status: "healthy", uptime: 99.7, responseTime: 300 }
  ];

  useEffect(() => {
    // Advanced reports data with AI insights
    setReports([
      {
        id: 1,
        name: "AI Recommendation Performance Report",
        type: "Scheduled",
        lastGenerated: "2024-01-15",
        status: "Completed",
        size: "4.2 MB",
        format: "PDF",
        insights: ["AI accuracy improved by 12%", "User satisfaction at 93%"],
        priority: "high"
      },
      {
        id: 2,
        name: "Predictive Analytics Dashboard",
        type: "Custom",
        lastGenerated: "2024-01-10",
        status: "Completed",
        size: "2.8 MB",
        format: "Excel",
        insights: ["Next month applications predicted: 4200", "Skill gap reduction: 15%"],
        priority: "medium"
      },
      {
        id: 3,
        name: "Data Quality Assessment",
        type: "Scheduled",
        lastGenerated: "2024-01-05",
        status: "Completed",
        size: "1.9 MB",
        format: "PDF",
        insights: ["Overall data quality: 94.2%", "PM Portal API: 98% complete"],
        priority: "high"
      },
      {
        id: 4,
        name: "System Health & Performance",
        type: "Real-time",
        lastGenerated: "2024-01-15 14:30:00",
        status: "In Progress",
        size: "0 MB",
        format: "JSON",
        insights: ["AI Engine: 99.9% uptime", "API Gateway: Warning status"],
        priority: "critical"
      },
      {
        id: 5,
        name: "Conversion Funnel Analysis",
        type: "Custom",
        lastGenerated: "2024-01-12",
        status: "Completed",
        size: "3.1 MB",
        format: "PDF",
        insights: ["Portal to Application: 48%", "Selection rate: 12%"],
        priority: "medium"
      }
    ]);
  }, []);

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("✅ Advanced AI report generated successfully!");
    }, 1500);
  };

  const handleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh) {
      alert("🔄 Auto-refresh enabled for real-time updates");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "In Progress": return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "Failed": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "Real-time": return <Activity className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "In Progress": return "bg-yellow-100 text-yellow-700";
      case "Failed": return "bg-red-100 text-red-700";
      case "Real-time": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "high": return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "healthy": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Advanced Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Advanced Analytics & AI Reports</h1>
              <p className="text-purple-100 text-lg">
                AI-powered insights, predictive analytics, and real-time system monitoring
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{reportStats[0].value.toLocaleString()}</div>
                  <div className="text-purple-200 text-sm">AI Recommendations</div>
                </div>
                <div className="w-px h-12 bg-purple-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{reportStats[1].value}%</div>
                  <div className="text-purple-200 text-sm">Data Quality</div>
                </div>
                <div className="w-px h-12 bg-purple-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{reportStats[2].value}</div>
                  <div className="text-purple-200 text-sm">Real-time Syncs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Advanced Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {typeof stat.value === 'number' && stat.value > 1000 ? 
                    stat.value.toLocaleString() : stat.value}
                  {stat.title.includes('Score') ? '%' : ''}
                </p>
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change} from last month
                </p>
                <p className="text-gray-400 text-xs mt-2">{stat.description}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'purple' ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Report Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">AI-Powered Report Generator</h2>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAutoRefresh}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              Auto-refresh
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="monthly">AI Performance Report</option>
              <option value="quarterly">Predictive Analytics</option>
              <option value="annual">Data Quality Assessment</option>
              <option value="custom">System Health Monitor</option>
              <option value="realtime">Real-time Insights</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="realtime">Real-time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metrics</label>
            <select
              multiple
              value={selectedMetrics}
              onChange={(e) => setSelectedMetrics(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="applications">Applications</option>
              <option value="success">Success Rate</option>
              <option value="ai_accuracy">AI Accuracy</option>
              <option value="user_satisfaction">User Satisfaction</option>
              <option value="data_quality">Data Quality</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              {loading ? "Generating..." : "Generate AI Report"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Advanced AI Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Performance Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">AI Performance Trends</h3>
              <p className="text-gray-500 text-sm">Accuracy, recommendations, and user satisfaction</p>
            </div>
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={aiPerformanceData}>
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
              <Area yAxisId="left" type="monotone" dataKey="recommendations" fill="#3B82F6" fillOpacity={0.3} stroke="#3B82F6" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="userSatisfaction" stroke="#F59E0B" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">AI Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">User Satisfaction</span>
            </div>
          </div>
        </motion.div>

        {/* Predictive Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Predictive Analytics</h3>
              <p className="text-gray-500 text-sm">AI-powered future insights</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-4">
            {predictiveInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-700 font-medium text-sm">{insight.metric}</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 text-xs font-medium">{insight.confidence}% confidence</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {typeof insight.predicted === 'number' && insight.predicted > 1000 ? 
                    insight.predicted.toLocaleString() : insight.predicted}
                  {insight.metric.includes('Improvement') ? '%' : ''}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.confidence}%` }}
                    transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                    className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Data Quality & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Data Quality Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Data Quality Metrics</h3>
              <p className="text-gray-500 text-sm">Completeness, accuracy, and freshness by source</p>
            </div>
            <Database className="w-6 h-6 text-purple-500" />
          </div>
          <div className="space-y-4">
            {dataQualityMetrics.map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                className="p-4 border border-gray-100 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-800">{source.source}</span>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: source.color }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Completeness</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${source.completeness}%` }}
                        transition={{ duration: 1, delay: 1.0 + index * 0.1 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: source.color }}
                      ></motion.div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{source.completeness}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Accuracy</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${source.accuracy}%` }}
                        transition={{ duration: 1, delay: 1.1 + index * 0.1 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: source.color }}
                      ></motion.div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{source.accuracy}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Freshness</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${source.freshness}%` }}
                        transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: source.color }}
                      ></motion.div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{source.freshness}%</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Health Monitor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">System Health Monitor</h3>
              <p className="text-gray-500 text-sm">Real-time system performance</p>
            </div>
            <Activity className="w-6 h-6 text-orange-500" />
          </div>
          <div className="space-y-4">
            {systemHealth.map((component, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                className="p-4 border border-gray-100 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-800">{component.component}</span>
                  <span className={`text-sm font-medium ${getHealthStatusColor(component.status)}`}>
                    {component.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Uptime</div>
                    <div className="text-lg font-bold text-gray-800">{component.uptime}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Response Time</div>
                    <div className="text-lg font-bold text-gray-800">{component.responseTime}ms</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${component.uptime}%` }}
                      transition={{ duration: 1, delay: 1.1 + index * 0.1 }}
                      className={`h-2 rounded-full ${
                        component.status === 'healthy' ? 'bg-green-500' :
                        component.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Conversion Funnel Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Conversion Funnel Analysis</h3>
            <p className="text-gray-500 text-sm">User journey from portal visits to selections</p>
          </div>
          <Target className="w-6 h-6 text-indigo-500" />
        </div>
        <div className="space-y-4">
          {conversionFunnel.map((stage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                   style={{ backgroundColor: stage.color }}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{stage.stage}</span>
                  <span className="text-sm text-gray-500">{stage.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentage}%` }}
                    transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                    className="h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  ></motion.div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{stage.count.toLocaleString()} users</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Advanced Reports Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Advanced Reports Management</h3>
              <p className="text-gray-500 text-sm">AI-powered reports with insights and analytics</p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Database className="w-4 h-4" />
                Sync with PM Portal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Bell className="w-4 h-4" />
                Schedule Report
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Report Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Last Generated</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Size</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{report.name}</div>
                    <div className="text-sm text-gray-500">{report.format}</div>
                    {report.insights && (
                      <div className="mt-1">
                        {report.insights.slice(0, 1).map((insight, idx) => (
                          <div key={idx} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {insight}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.type === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 
                      report.type === 'Real-time' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{report.lastGenerated}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{report.size}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Download Report"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Refresh Report"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                        title="View Insights"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Share Report"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    </div>
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