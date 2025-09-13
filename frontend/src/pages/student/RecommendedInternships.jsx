import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  MapPin, Briefcase, Clock, Star, Filter, 
  RefreshCw, TrendingUp, Users, Award, Brain,
  ArrowRight, Bookmark, Eye, CheckCircle, AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudentTranslation } from '../../hooks/useTranslation.jsx';
import { getRecommendations } from '../../api/internships.js';
import RecommendationFilters from '../../components/RecommendationFilters.jsx';
import toast from 'react-hot-toast';

export default function RecommendedInternships() {
  const { t } = useStudentTranslation();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState({ mlUsed: false, fallback: false });
  const [activeFilters, setActiveFilters] = useState({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Load recommendations on component mount
  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getRecommendations(filters);
      
      if (response.success && response.data.recommendations) {
        setRecommendations(response.data.recommendations);
        setDataSource({
          mlUsed: response.data.mlServiceUsed || false,
          fallback: response.data.fallback || false
        });
        
        // Show different messages based on data source and filters
        const hasFilters = Object.keys(filters).some(key => {
          const value = filters[key];
          return Array.isArray(value) ? value.length > 0 : value !== '';
        });
        
        if (response.data.mlServiceUsed) {
          if (hasFilters) {
            toast.success(`🤖 AI-powered filtered recommendations: ${response.data.recommendations.length} personalized matches!`);
          } else {
            toast.success(`🤖 AI-powered recommendations: ${response.data.recommendations.length} personalized matches!`);
          }
        } else if (response.data.fallback) {
          if (hasFilters) {
            toast.success(`📋 Curated filtered recommendations: ${response.data.recommendations.length} high-quality opportunities!`);
          } else {
            toast.success(`📋 Curated recommendations: ${response.data.recommendations.length} high-quality opportunities!`);
          }
        } else {
          if (hasFilters) {
            toast.success(`Found ${response.data.recommendations.length} filtered recommendations!`);
          } else {
            toast.success(`Found ${response.data.recommendations.length} personalized recommendations!`);
          }
        }
      } else {
        throw new Error(response.error?.message || 'Failed to load recommendations');
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError(err.message);
      toast.error('Failed to load recommendations. Please try again.');
      
      // Set fallback recommendations
      setRecommendations(getFallbackRecommendations());
      setDataSource({ mlUsed: false, fallback: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback recommendations for when API fails
  const getFallbackRecommendations = () => [
    {
      id: 1,
      title: "Digital India Intern",
      department: "Ministry of Electronics & IT",
      location: "Remote",
      type: "REMOTE",
      duration: 12,
      stipend: 12000,
      matchPercentage: 95,
      description: "Work on digital transformation projects and e-governance initiatives.",
      skills: ["Digital Literacy", "Communication", "Project Management"],
      category: "GOVERNMENT",
      status: "ACTIVE"
    },
    {
      id: 2,
      title: "Rural Development Intern",
      department: "Ministry of Rural Development",
      location: "Delhi",
      type: "ONSITE",
      duration: 24,
      stipend: 10000,
      matchPercentage: 92,
      description: "Assist in rural development programs and community outreach initiatives.",
      skills: ["Community Work", "Research", "Communication"],
      category: "GOVERNMENT",
      status: "ACTIVE"
    },
    {
      id: 3,
      title: "Skill Development Intern",
      department: "Ministry of Skill Development",
      location: "Mumbai",
      type: "ONSITE",
      duration: 16,
      stipend: 8000,
      matchPercentage: 88,
      description: "Support skill development programs and vocational training initiatives.",
      skills: ["Teaching", "Training", "Education"],
      category: "EDUCATION",
      status: "ACTIVE"
    }
  ];

  const filters = [
    { id: "all", label: "All Recommendations", count: recommendations.length },
    { id: "GOVERNMENT", label: "Government", count: recommendations.filter(r => r.category === "GOVERNMENT").length },
    { id: "EDUCATION", label: "Education", count: recommendations.filter(r => r.category === "EDUCATION").length },
    { id: "HEALTHCARE", label: "Healthcare", count: recommendations.filter(r => r.category === "HEALTHCARE").length },
    { id: "TECHNOLOGY", label: "Technology", count: recommendations.filter(r => r.category === "TECHNOLOGY").length },
    { id: "OTHER", label: "Other", count: recommendations.filter(r => r.category === "OTHER").length }
  ];

  const filteredRecommendations = selectedFilter === "all" 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedFilter);

  const handleRefreshRecommendations = async () => {
    setIsRefreshing(true);
    await loadRecommendations(activeFilters);
    setIsRefreshing(false);
  };

  const handleFiltersChange = async (filters) => {
    setActiveFilters(filters);
    await loadRecommendations(filters);
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
              <span className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600"></span>
              <span className="break-words">{t('recommendations.title')}</span>
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              {t('recommendations.subtitle')}
            </p>
            {/* Data Source Indicator */}
            <div className="mt-2 flex items-center">
              {dataSource.mlUsed ? (
                <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  <Brain className="w-3 h-3 mr-1" />
                  AI-Powered Recommendations
                </div>
              ) : dataSource.fallback ? (
                <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Curated Recommendations
                </div>
              ) : (
                <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Personalized Matches
                </div>
              )}
            </div>
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

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 sm:mb-8"
      >
        <RecommendationFilters 
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
          currentFilters={activeFilters}
        />
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI-powered recommendations...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="text-yellow-800 font-medium">Recommendations temporarily unavailable</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Showing fallback recommendations. Our AI is working to provide personalized suggestions.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations Grid */}
      {!isLoading && (
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
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{rec.department || rec.organization}</p>
                </div>
                <div className="flex items-center text-green-600 flex-shrink-0">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm font-medium">{rec.matchPercentage || rec.mlScore || 85}%</span>
                </div>
              </div>

              {/* Match Badge */}
              <div className="mb-3 sm:mb-4">
                <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                  (rec.matchPercentage || rec.mlScore || 85) >= 90 ? 'bg-green-100 text-green-800' :
                  (rec.matchPercentage || rec.mlScore || 85) >= 80 ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {(rec.matchPercentage || rec.mlScore || 85) >= 90 ? 'Excellent Match' :
                   (rec.matchPercentage || rec.mlScore || 85) >= 80 ? 'Good Match' : 'Fair Match'}
                  {rec.isMLGenerated && <span className="ml-1">🤖</span>}
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
                  <span className="text-xs sm:text-sm">{rec.type || 'Remote'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{rec.duration ? `${rec.duration} weeks` : '12 weeks'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-xs sm:text-sm font-medium">💰 ₹{rec.stipend || 0}/month</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{rec.description}</p>

              {/* Skills */}
              <div className="mb-3 sm:mb-4">
                <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {(rec.skills || rec.requirements || []).slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {(rec.skills || rec.requirements || []).length > 3 && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-500 text-xs rounded">
                      +{(rec.skills || rec.requirements || []).length - 3} more
                    </span>
                  )}
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
      )}

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