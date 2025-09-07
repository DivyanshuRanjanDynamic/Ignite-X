// src/pages/admin/InternshipData.jsx
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
  AreaChart
} from "recharts";
import { 
  Building2, 
  Briefcase, 
  AlertTriangle, 
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  Target,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function InternshipData() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [internships, setInternships] = useState([]);

  // Enhanced data with more details
  const stats = [
    { 
      title: "Total Internships", 
      value: 5420, 
      change: "+12%",
      changeType: "positive",
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      color: "blue"
    },
    { 
      title: "Active Internships", 
      value: 3890, 
      change: "+8%",
      changeType: "positive",
      icon: <Building2 className="w-8 h-8 text-green-600" />,
      color: "green"
    },
    { 
      title: "Pending Approval", 
      value: 156, 
      change: "-3%",
      changeType: "negative",
      icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />,
      color: "yellow"
    },
    { 
      title: "Expired Listings", 
      value: 210, 
      change: "+2%",
      changeType: "negative",
      icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
      color: "red"
    },
  ];

  const categoryDistribution = [
    { name: "Technology", value: 35, color: "#3B82F6", applications: 1250 },
    { name: "Government", value: 25, color: "#10B981", applications: 890 },
    { name: "Healthcare", value: 15, color: "#F59E0B", applications: 540 },
    { name: "Education", value: 12, color: "#8B5CF6", applications: 430 },
    { name: "Finance", value: 8, color: "#EF4444", applications: 290 },
    { name: "Others", value: 5, color: "#06B6D4", applications: 180 },
  ];

  const regionalDistribution = [
    { state: "Maharashtra", internships: 850, applications: 3200, color: "#3B82F6" },
    { state: "Karnataka", internships: 720, applications: 2800, color: "#10B981" },
    { state: "Tamil Nadu", internships: 580, applications: 2100, color: "#F59E0B" },
    { state: "Delhi", internships: 450, applications: 1900, color: "#8B5CF6" },
    { state: "Gujarat", internships: 380, applications: 1500, color: "#EF4444" },
    { state: "Others", internships: 1840, applications: 1840, color: "#06B6D4" },
  ];

  const internshipTrend = [
    { month: "Jan", postings: 300, applications: 1200 },
    { month: "Feb", postings: 450, applications: 1800 },
    { month: "Mar", postings: 500, applications: 2000 },
    { month: "Apr", postings: 400, applications: 1600 },
    { month: "May", postings: 600, applications: 2400 },
    { month: "Jun", postings: 700, applications: 2800 },
  ];

  useEffect(() => {
    // Mock internship data
    setInternships([
      {
        id: 1,
        title: "Software Development Intern",
        company: "TechCorp India",
        location: "Mumbai, Maharashtra",
        category: "Technology",
        status: "Active",
        applications: 45,
        postedDate: "2024-01-15",
        deadline: "2024-02-15",
        stipend: "₹15,000/month"
      },
      {
        id: 2,
        title: "Data Analysis Intern",
        company: "Government of India",
        location: "New Delhi",
        category: "Government",
        status: "Active",
        applications: 32,
        postedDate: "2024-01-20",
        deadline: "2024-02-20",
        stipend: "₹12,000/month"
      },
      {
        id: 3,
        title: "Marketing Intern",
        company: "StartupXYZ",
        location: "Bangalore, Karnataka",
        category: "Marketing",
        status: "Pending",
        applications: 18,
        postedDate: "2024-01-25",
        deadline: "2024-02-25",
        stipend: "₹10,000/month"
      },
      {
        id: 4,
        title: "Healthcare Research Intern",
        company: "MedResearch Institute",
        location: "Chennai, Tamil Nadu",
        category: "Healthcare",
        status: "Active",
        applications: 28,
        postedDate: "2024-01-10",
        deadline: "2024-02-10",
        stipend: "₹8,000/month"
      },
      {
        id: 5,
        title: "Finance Intern",
        company: "Bank of India",
        location: "Mumbai, Maharashtra",
        category: "Finance",
        status: "Expired",
        applications: 15,
        postedDate: "2023-12-01",
        deadline: "2024-01-01",
        stipend: "₹18,000/month"
      }
    ]);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Expired": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Expired": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || internship.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || internship.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Internship Data Management</h1>
            <p className="text-green-100 text-sm md:text-base lg:text-lg">
              Monitor and manage all internship listings from PM Portal
            </p>
          </div>
          <div className="flex lg:hidden">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center bg-green-700/30 rounded-lg p-3">
                <div className="text-lg md:text-xl font-bold">{stats[0].value.toLocaleString()}</div>
                <div className="text-green-200 text-xs md:text-sm">Total</div>
              </div>
              <div className="text-center bg-green-700/30 rounded-lg p-3">
                <div className="text-lg md:text-xl font-bold">{stats[1].value.toLocaleString()}</div>
                <div className="text-green-200 text-xs md:text-sm">Active</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats[0].value.toLocaleString()}</div>
                <div className="text-green-200 text-sm">Total Internships</div>
              </div>
              <div className="w-px h-12 bg-green-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats[1].value.toLocaleString()}</div>
                <div className="text-green-200 text-sm">Active Listings</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                stat.color === 'yellow' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Government">Government</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Internship</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      </div>

      {/* Internship Posting Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Internship Posting Trends</h3>
            <p className="text-gray-500 text-xs md:text-sm">Monthly posting and application trends</p>
          </div>
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={internshipTrend}>
            <defs>
              <linearGradient id="colorPostings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="postings" 
              stroke="#10B981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPostings)" 
            />
            <Area 
              type="monotone" 
              dataKey="applications" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorApplications)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 md:gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs md:text-sm text-gray-600">Postings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs md:text-sm text-gray-600">Applications</span>
          </div>
        </div>
      </motion.div>

      {/* Internships Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-4 md:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Internship Listings</h3>
              <p className="text-gray-500 text-xs md:text-sm">Manage all internship postings</p>
            </div>
            <div className="text-xs md:text-sm text-gray-500">
              Showing {filteredInternships.length} of {internships.length} internships
            </div>
          </div>
        </div>
        
        {/* Mobile Card View */}
        <div className="block md:hidden">
          <div className="p-4 space-y-4">
            {filteredInternships.map((internship) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{internship.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{internship.company}</p>
                    <p className="text-xs text-gray-500">{internship.stipend}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {internship.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${getStatusColor(internship.status)}`}>
                    {getStatusIcon(internship.status)}
                    {internship.status}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Users className="w-3 h-3" />
                    {internship.applications}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  📍 {internship.location}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Internship</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Company</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Applications</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInternships.map((internship) => (
                <motion.tr
                  key={internship.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-800">{internship.title}</div>
                      <div className="text-sm text-gray-500">{internship.stipend}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{internship.company}</td>
                  <td className="px-6 py-4 text-gray-600">{internship.location}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {internship.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(internship.status)}`}>
                      {getStatusIcon(internship.status)}
                      {internship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-800">{internship.applications}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
    </div>
  );
}