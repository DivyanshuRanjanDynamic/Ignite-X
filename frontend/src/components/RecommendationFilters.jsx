import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, MapPin, Code, GraduationCap, DollarSign, 
  X, ChevronDown, ChevronUp, Search, RotateCcw
} from 'lucide-react';

const RecommendationFilters = ({ 
  onFiltersChange, 
  isLoading = false,
  currentFilters = {} 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    skills: [],
    domain: '',
    educationLevel: '',
    minAmount: '',
    maxAmount: '',
    workPreference: '',
    duration: ''
  });

  // Predefined options
  const locationOptions = [
    'Remote', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh'
  ];

  const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL',
    'Machine Learning', 'Data Analysis', 'Project Management', 'Communication',
    'Leadership', 'Research', 'Writing', 'Design', 'Marketing', 'Finance',
    'Digital Marketing', 'Content Writing', 'Teaching', 'Training'
  ];

  const domainOptions = [
    'Technology', 'Government', 'Education', 'Healthcare', 'Finance',
    'Marketing', 'Research', 'Social Work', 'Environment', 'Agriculture',
    'Manufacturing', 'Retail', 'Media', 'Sports', 'Arts'
  ];

  const educationOptions = [
    'High School', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 
    'PhD', 'Professional Certification', 'Any'
  ];

  const workPreferenceOptions = [
    'Remote', 'Onsite', 'Hybrid', 'Any'
  ];

  const durationOptions = [
    '1-4 weeks', '1-2 months', '2-4 months', '4-6 months', '6+ months', 'Any'
  ];

  // Initialize filters from props
  useEffect(() => {
    if (currentFilters) {
      setFilters(prev => ({ ...prev, ...currentFilters }));
    }
  }, [currentFilters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSkillToggle = (skill) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    
    handleFilterChange('skills', newSkills);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      location: '',
      skills: [],
      domain: '',
      educationLevel: '',
      minAmount: '',
      maxAmount: '',
      workPreference: '',
      duration: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.skills.length > 0) count++;
    if (filters.domain) count++;
    if (filters.educationLevel) count++;
    if (filters.minAmount || filters.maxAmount) count++;
    if (filters.workPreference) count++;
    if (filters.duration) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Filter Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Advanced Filters
          </h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllFilters();
              }}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Filter Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                
                {/* Location Filter */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                  >
                    <option value="">Any Location</option>
                    {locationOptions.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Domain Filter */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Code className="w-4 h-4 mr-2 text-green-600" />
                    Preferred Domain
                  </label>
                  <select
                    value={filters.domain}
                    onChange={(e) => handleFilterChange('domain', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                  >
                    <option value="">Any Domain</option>
                    {domainOptions.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                {/* Education Level Filter */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <GraduationCap className="w-4 h-4 mr-2 text-purple-600" />
                    Education Level
                  </label>
                  <select
                    value={filters.educationLevel}
                    onChange={(e) => handleFilterChange('educationLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                  >
                    <option value="">Any Education</option>
                    {educationOptions.map(education => (
                      <option key={education} value={education}>{education}</option>
                    ))}
                  </select>
                </div>

                {/* Work Preference Filter */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                    Work Preference
                  </label>
                  <select
                    value={filters.workPreference}
                    onChange={(e) => handleFilterChange('workPreference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                  >
                    <option value="">Any Preference</option>
                    {workPreferenceOptions.map(preference => (
                      <option key={preference} value={preference}>{preference}</option>
                    ))}
                  </select>
                </div>

                {/* Duration Filter */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Search className="w-4 h-4 mr-2 text-indigo-600" />
                    Duration
                  </label>
                  <select
                    value={filters.duration}
                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                  >
                    <option value="">Any Duration</option>
                    {durationOptions.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>

                {/* Amount Range Filter */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    Stipend Range (₹/month)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minAmount}
                      onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      disabled={isLoading}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAmount}
                      onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Skills Filter */}
              <div className="mt-6 space-y-3">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Code className="w-4 h-4 mr-2 text-blue-600" />
                  Skills ({filters.skills.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      disabled={isLoading}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                        filters.skills.includes(skill)
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.location && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Location: {filters.location}
                        <button
                          onClick={() => handleFilterChange('location', '')}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.skills.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Skills: {filters.skills.length}
                        <button
                          onClick={() => handleFilterChange('skills', [])}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.domain && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Domain: {filters.domain}
                        <button
                          onClick={() => handleFilterChange('domain', '')}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.educationLevel && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Education: {filters.educationLevel}
                        <button
                          onClick={() => handleFilterChange('educationLevel', '')}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {(filters.minAmount || filters.maxAmount) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Stipend: ₹{filters.minAmount || '0'} - ₹{filters.maxAmount || '∞'}
                        <button
                          onClick={() => {
                            handleFilterChange('minAmount', '');
                            handleFilterChange('maxAmount', '');
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecommendationFilters;
