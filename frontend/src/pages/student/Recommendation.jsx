// src/pages/student/Recommendation.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, Briefcase, Clock, Bookmark, Eye, Brain, Star, 
  Filter, RefreshCw, TrendingUp, Users, Award 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Recommendation() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const recommendations = [
    {
      id: 1,
      title: "Digital India Intern",
      company: "Ministry of Electronics & IT",
      location: "Remote",
      type: "Government",
      duration: "3 Months",
      stipend: "₹12,000",
      match: 95,
      description: "Work on digital transformation projects and e-governance initiatives.",
      skills: ["Digital Literacy", "Communication", "Project Management"],
      category: "government"
    },
    {
      id: 2,
      title: "Rural Development Intern",
      company: "Ministry of Rural Development",
      location: "Delhi",
      type: "Social Impact",
      duration: "6 Months",
      stipend: "₹10,000",
      match: 92,
      description: "Assist in rural development programs and community outreach initiatives.",
      skills: ["Community Work", "Research", "Communication"],
      category: "social"
    },
    {
      id: 3,
      title: "Skill Development Intern",
      company: "Ministry of Skill Development",
      location: "Mumbai",
      type: "Education",
      duration: "4 Months",
      stipend: "₹8,000",
      match: 88,
      description: "Support skill development programs and vocational training initiatives.",
      skills: ["Teaching", "Training", "Education"],
      category: "education"
    },
    {
      id: 4,
      title: "Healthcare Outreach Intern",
      company: "Ministry of Health & Family Welfare",
      location: "Hyderabad",
      type: "Healthcare",
      duration: "5 Months",
      stipend: "₹9,000",
      match: 85,
      description: "Assist in public health campaigns and healthcare awareness programs.",
      skills: ["Healthcare", "Communication", "Community Work"],
      category: "healthcare"
    },
    {
      id: 5,
      title: "Women Empowerment Intern",
      company: "Ministry of Women & Child Development",
      location: "Chennai",
      type: "Social Impact",
      duration: "3 Months",
      stipend: "₹7,000",
      match: 82,
      description: "Support women empowerment initiatives and child development programs.",
      skills: ["Social Work", "Communication", "Research"],
      category: "social"
    },
    {
      id: 6,
      title: "Environmental Conservation Intern",
      company: "Ministry of Environment, Forest & Climate Change",
      location: "Bangalore",
      type: "Environment",
      duration: "4 Months",
      stipend: "₹11,000",
      match: 80,
      description: "Work on environmental conservation projects and climate change initiatives.",
      skills: ["Environmental Science", "Research", "Project Management"],
      category: "environment"
    }
  ];

  const filters = [
    { id: "all", label: "All Recommendations", count: recommendations.length },
    { id: "government", label: "Government", count: recommendations.filter(r => r.category === "government").length },
    { id: "social", label: "Social Impact", count: recommendations.filter(r => r.category === "social").length },
    { id: "education", label: "Education", count: recommendations.filter(r => r.category === "education").length },
    { id: "healthcare", label: "Healthcare", count: recommendations.filter(r => r.category === "healthcare").length },
    { id: "environment", label: "Environment", count: recommendations.filter(r => r.category === "environment").length }
  ];

  const filteredRecommendations = selectedFilter === "all" 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedFilter);

  const handleRefreshRecommendations = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-blue-600" />
              AI-Powered Recommendations
            </h1>
            <p className="text-gray-600 mt-2">
              Personalized internship suggestions based on your profile and preferences
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

        {/* AI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">AI Match Accuracy</p>
                <p className="text-2xl font-bold">95%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Matches</p>
                <p className="text-2xl font-bold">{recommendations.length}</p>
              </div>
              <Users className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Success Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <Award className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedFilter === filter.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recommendations Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRecommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition transform duration-300 ease-in-out border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{rec.title}</h3>
                <p className="text-sm text-gray-600">{rec.company}</p>
              </div>
              <div className="flex items-center text-green-600">
                <Star className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{rec.match}%</span>
              </div>
            </div>

            {/* Match Badge */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                rec.match >= 90 ? 'bg-green-100 text-green-800' :
                rec.match >= 80 ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {rec.match >= 90 ? 'Excellent Match' :
                 rec.match >= 80 ? 'Good Match' : 'Fair Match'}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-sm">{rec.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm">{rec.type}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm">{rec.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="text-sm font-medium">💰 {rec.stipend}/month</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{rec.description}</p>

            {/* Skills */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-1">
                {rec.skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/apply/${rec.id}`)}
                className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Apply Now
              </button>
              <button
                className="flex items-center justify-center gap-1 bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate(`/internship-details/${rec.id}`)}
                className="flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredRecommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-600">Try adjusting your filters or refresh the AI recommendations.</p>
        </motion.div>
      )}
    </div>
  );
}







