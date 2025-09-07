import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Search, MapPin, Briefcase, Clock, Star, Filter, 
  Building, Users, Award, TrendingUp 
} from "lucide-react";
import Navbar from "../components/Navbar";

function InternshipList() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Enhanced sample data aligned with PM Internship Scheme
  const internships = [
    { 
      id: 1, 
      title: "Digital India Intern", 
      company: "Ministry of Electronics & IT", 
      location: "Remote", 
      stipend: "₹12,000", 
      duration: "3 Months",
      category: "Government",
      type: "Remote",
      match: 95,
      description: "Work on digital transformation projects and e-governance initiatives.",
      skills: ["Digital Literacy", "Communication", "Project Management"]
    },
    { 
      id: 2, 
      title: "Rural Development Intern", 
      company: "Ministry of Rural Development", 
      location: "Delhi", 
      stipend: "₹10,000", 
      duration: "6 Months",
      category: "Social Impact",
      type: "Onsite",
      match: 92,
      description: "Assist in rural development programs and community outreach initiatives.",
      skills: ["Community Work", "Research", "Communication"]
    },
    { 
      id: 3, 
      title: "Skill Development Intern", 
      company: "Ministry of Skill Development", 
      location: "Mumbai", 
      stipend: "₹8,000", 
      duration: "4 Months",
      category: "Education",
      type: "Hybrid",
      match: 88,
      description: "Support skill development programs and vocational training initiatives.",
      skills: ["Teaching", "Training", "Education"]
    },
    { 
      id: 4, 
      title: "Healthcare Outreach Intern", 
      company: "Ministry of Health & Family Welfare", 
      location: "Hyderabad", 
      stipend: "₹9,000", 
      duration: "5 Months",
      category: "Healthcare",
      type: "Onsite",
      match: 85,
      description: "Assist in public health campaigns and healthcare awareness programs.",
      skills: ["Healthcare", "Communication", "Community Work"]
    },
    { 
      id: 5, 
      title: "Women Empowerment Intern", 
      company: "Ministry of Women & Child Development", 
      location: "Chennai", 
      stipend: "₹7,000", 
      duration: "3 Months",
      category: "Social Impact",
      type: "Hybrid",
      match: 82,
      description: "Support women empowerment initiatives and child development programs.",
      skills: ["Social Work", "Communication", "Research"]
    },
    { 
      id: 6, 
      title: "Environmental Conservation Intern", 
      company: "Ministry of Environment, Forest & Climate Change", 
      location: "Bangalore", 
      stipend: "₹11,000", 
      duration: "4 Months",
      category: "Environment",
      type: "Onsite",
      match: 80,
      description: "Work on environmental conservation projects and climate change initiatives.",
      skills: ["Environmental Science", "Research", "Project Management"]
    }
  ];

  const categories = [
    { id: "all", label: "All Categories", count: internships.length },
    { id: "Government", label: "Government", count: internships.filter(i => i.category === "Government").length },
    { id: "Social Impact", label: "Social Impact", count: internships.filter(i => i.category === "Social Impact").length },
    { id: "Education", label: "Education", count: internships.filter(i => i.category === "Education").length },
    { id: "Healthcare", label: "Healthcare", count: internships.filter(i => i.category === "Healthcare").length },
    { id: "Environment", label: "Environment", count: internships.filter(i => i.category === "Environment").length }
  ];

  const locations = [
    { id: "all", label: "All Locations" },
    { id: "Remote", label: "Remote" },
    { id: "Delhi", label: "Delhi" },
    { id: "Mumbai", label: "Mumbai" },
    { id: "Hyderabad", label: "Hyderabad" },
    { id: "Chennai", label: "Chennai" },
    { id: "Bangalore", label: "Bangalore" }
  ];

  const filteredInternships = internships.filter((i) => {
    const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
                         i.company.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || i.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || i.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PM Internship Opportunities
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover internships across various ministries and government organizations. 
            Find opportunities that match your skills and aspirations.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 text-center">
            <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{internships.length}</p>
            <p className="text-gray-600 text-sm">Total Internships</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">6</p>
            <p className="text-gray-600 text-sm">Ministries</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">28</p>
            <p className="text-gray-600 text-sm">States Covered</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">95%</p>
            <p className="text-gray-600 text-sm">Success Rate</p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by role, company, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredInternships.length}</span> internships
          </p>
        </motion.div>

        {/* Internship Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredInternships.map((internship, index) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition transform duration-300 border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{internship.title}</h3>
                  <p className="text-sm text-gray-600">{internship.company}</p>
                </div>
                <div className="flex items-center text-green-600">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{internship.match}%</span>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {internship.category}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-sm">{internship.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm">{internship.type}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm">{internship.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-sm font-medium">💰 {internship.stipend}/month</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{internship.description}</p>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {internship.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {internship.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{internship.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/internship/${internship.id}`}
                  className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  View Details
                </Link>
                <button className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredInternships.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No internships found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default InternshipList;
