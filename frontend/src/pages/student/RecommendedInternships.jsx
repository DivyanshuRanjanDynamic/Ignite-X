import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  MapPin, Briefcase, Clock, Star, Filter, 
  RefreshCw, TrendingUp, Users, Award, Brain,
  ArrowRight, Bookmark, Eye, CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudentTranslation } from '../../hooks/useTranslation.jsx';

export default function RecommendedInternships() {
  const { t } = useStudentTranslation();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);
 
  // Mock data for PM Internship Scheme
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
      category: "government",
      status: "Available"
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
      category: "social",
      status: "Available"
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
      category: "education",
      status: "Available"
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
      category: "healthcare",
      status: "Available"
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
      category: "social",
      status: "Available"
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
      category: "environment",
      status: "Available"
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
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
              <span className="break-words">{t('recommendations.title')}</span>
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              {t('recommendations.subtitle')}
            </p>
          </div>
          <button
            onClick={handleRefreshRecommendations}
            disabled={isRefreshing}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
          >
            <RefreshCw className={`w-4 h-4 mr-1 sm:mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('recommendations.refreshAI')}</span>
            <span className="sm:hidden">{t('recommendations.refreshAI')}</span>
          </button>
        </div>

        {/* AI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">{t('recommendations.stats.aiMatchAccuracy')}</p>
                <p className="text-xl sm:text-2xl font-bold">95%</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">{t('recommendations.stats.totalMatches')}</p>
                <p className="text-xl sm:text-2xl font-bold">{recommendations.length}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">{t('recommendations.stats.successRate')}</p>
                <p className="text-xl sm:text-2xl font-bold">87%</p>
              </div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex items-center mb-3 sm:mb-4">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t('recommendations.filterByCategory')}</h3>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                selectedFilter === filter.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="hidden sm:inline">{filter.label} ({filter.count})</span>
              <span className="sm:hidden">{filter.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recommendations Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {filteredRecommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl hover:scale-[1.02] transition transform duration-300 border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex-1 pr-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{rec.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{rec.company}</p>
              </div>
              <div className="flex items-center text-green-600 flex-shrink-0">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="text-xs sm:text-sm font-medium">{rec.match}%</span>
              </div>
            </div>

            {/* Match Badge */}
            <div className="mb-3 sm:mb-4">
              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                rec.match >= 90 ? 'bg-green-100 text-green-800' :
                rec.match >= 80 ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {rec.match >= 90 ? 'Excellent Match' :
                 rec.match >= 80 ? 'Good Match' : 'Fair Match'}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-3 sm:mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-red-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm line-clamp-1">{rec.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{rec.type}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{rec.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="text-xs sm:text-sm font-medium">💰 {rec.stipend}/month</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{rec.description}</p>

            {/* Skills */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-1">
                {rec.skills.map((skill, idx) => (
                  <span key={idx} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/apply/${rec.id}`)}
                className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition"
              >
                <span className="hidden sm:inline">Apply Now</span>
                <span className="sm:hidden">Apply</span>
              </button>
              <button className="flex items-center justify-center gap-1 bg-gray-200 text-gray-800 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-300 transition">
                <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => navigate(`/internship/${rec.id}`)}
                className="flex items-center justify-center gap-1 bg-green-600 text-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-green-700 transition"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-1">View</span>
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
          className="text-center py-8 sm:py-12"
        >
          <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-sm sm:text-base text-gray-600 px-4">Try adjusting your filters or refresh the AI recommendations.</p>
        </motion.div>
      )}
    </div>
  );
}