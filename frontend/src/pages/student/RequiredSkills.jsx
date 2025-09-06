import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, CheckCircle, Clock, Star, Target, 
  TrendingUp, Award, Play, Bookmark, ExternalLink,
  Code, Database, Globe, Smartphone, BarChart3,
  Filter, Search, ArrowRight, Users, Zap, Shield
} from "lucide-react";

export default function RequiredSkills() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("importance");

  // Comprehensive skills data for PM Internship Scheme
  const skillsData = [
    {
      id: 1,
      name: "Digital Literacy",
      category: "Digital Skills",
      level: "Beginner",
      importance: "High",
      description: "Essential digital skills for modern workplace including basic computer operations, internet navigation, and digital communication",
      progress: 80,
      estimatedTime: "1-2 weeks",
      resources: [
        { name: "Digital India Tutorial", type: "Tutorial", url: "#", duration: "2 hours" },
        { name: "Basic Computer Skills", type: "Course", url: "#", duration: "5 hours" },
        { name: "Internet Safety Guide", type: "Documentation", url: "#", duration: "1 hour" }
      ],
      relatedInternships: 25,
      demand: "Very High",
      completionRate: 95,
      avgSalary: "₹15,000"
    },
    {
      id: 2,
      name: "Communication Skills",
      category: "Soft Skills",
      level: "Beginner",
      importance: "High",
      description: "Verbal and written communication skills essential for professional environments and team collaboration",
      progress: 70,
      estimatedTime: "2-3 weeks",
      resources: [
        { name: "Professional Communication", type: "Course", url: "#", duration: "8 hours" },
        { name: "Email Writing Guide", type: "Tutorial", url: "#", duration: "3 hours" },
        { name: "Presentation Skills", type: "Workshop", url: "#", duration: "4 hours" }
      ],
      relatedInternships: 30,
      demand: "Very High",
      completionRate: 88,
      avgSalary: "₹18,000"
    },
    {
      id: 3,
      name: "Python Programming",
      category: "Programming",
      level: "Intermediate",
      importance: "High",
      description: "Versatile programming language for web development, data analysis, and automation",
      progress: 45,
      estimatedTime: "4-6 weeks",
      resources: [
        { name: "Python for Beginners", type: "Course", url: "#", duration: "20 hours" },
        { name: "Data Analysis with Python", type: "Tutorial", url: "#", duration: "12 hours" },
        { name: "Build a Web App", type: "Project", url: "#", duration: "15 hours" }
      ],
      relatedInternships: 18,
      demand: "Very High",
      completionRate: 75,
      avgSalary: "₹25,000"
    },
    {
      id: 4,
      name: "React.js",
      category: "Frontend",
      level: "Intermediate",
      importance: "Medium",
      description: "Modern JavaScript library for building interactive user interfaces and web applications",
      progress: 30,
      estimatedTime: "5-7 weeks",
      resources: [
        { name: "React Official Tutorial", type: "Tutorial", url: "#", duration: "15 hours" },
        { name: "React Hooks Guide", type: "Documentation", url: "#", duration: "8 hours" },
        { name: "Build a Todo App", type: "Project", url: "#", duration: "10 hours" }
      ],
      relatedInternships: 12,
      demand: "High",
      completionRate: 65,
      avgSalary: "₹30,000"
    },
    {
      id: 5,
      name: "SQL Database",
      category: "Database",
      level: "Beginner",
      importance: "Medium",
      description: "Structured Query Language for database management and data manipulation",
      progress: 60,
      estimatedTime: "3-4 weeks",
      resources: [
        { name: "SQL Basics", type: "Tutorial", url: "#", duration: "10 hours" },
        { name: "Database Design", type: "Course", url: "#", duration: "12 hours" },
        { name: "Practice Queries", type: "Exercise", url: "#", duration: "8 hours" }
      ],
      relatedInternships: 15,
      demand: "High",
      completionRate: 80,
      avgSalary: "₹22,000"
    },
    {
      id: 6,
      name: "Project Management",
      category: "Management",
      level: "Beginner",
      importance: "Medium",
      description: "Essential project management skills including planning, execution, and team coordination",
      progress: 55,
      estimatedTime: "3-4 weeks",
      resources: [
        { name: "PM Basics", type: "Course", url: "#", duration: "12 hours" },
        { name: "Agile Methodology", type: "Tutorial", url: "#", duration: "6 hours" },
        { name: "Team Leadership", type: "Workshop", url: "#", duration: "8 hours" }
      ],
      relatedInternships: 20,
      demand: "High",
      completionRate: 70,
      avgSalary: "₹20,000"
    },
    {
      id: 7,
      name: "Data Analysis",
      category: "Analytics",
      level: "Intermediate",
      importance: "Medium",
      description: "Analyzing data to extract insights and make informed business decisions",
      progress: 25,
      estimatedTime: "4-5 weeks",
      resources: [
        { name: "Excel for Data Analysis", type: "Course", url: "#", duration: "10 hours" },
        { name: "Data Visualization", type: "Tutorial", url: "#", duration: "8 hours" },
        { name: "Real Dataset Analysis", type: "Project", url: "#", duration: "12 hours" }
      ],
      relatedInternships: 10,
      demand: "High",
      completionRate: 60,
      avgSalary: "₹28,000"
    },
    {
      id: 8,
      name: "Git Version Control",
      category: "Tools",
      level: "Beginner",
      importance: "Medium",
      description: "Distributed version control system for tracking changes in code and collaboration",
      progress: 40,
      estimatedTime: "2-3 weeks",
      resources: [
        { name: "Git Tutorial", type: "Tutorial", url: "#", duration: "6 hours" },
        { name: "GitHub Guide", type: "Documentation", url: "#", duration: "4 hours" },
        { name: "Collaborative Workflow", type: "Practice", url: "#", duration: "5 hours" }
      ],
      relatedInternships: 8,
      demand: "Medium",
      completionRate: 75,
      avgSalary: "₹24,000"
    }
  ];

  const categories = [
    { id: "all", label: "All Skills", icon: BookOpen, count: skillsData.length },
    { id: "Digital Skills", label: "Digital Skills", icon: Globe, count: skillsData.filter(s => s.category === "Digital Skills").length },
    { id: "Soft Skills", label: "Soft Skills", icon: Users, count: skillsData.filter(s => s.category === "Soft Skills").length },
    { id: "Programming", label: "Programming", icon: Code, count: skillsData.filter(s => s.category === "Programming").length },
    { id: "Frontend", label: "Frontend", icon: Globe, count: skillsData.filter(s => s.category === "Frontend").length },
    { id: "Database", label: "Database", icon: Database, count: skillsData.filter(s => s.category === "Database").length },
    { id: "Management", label: "Management", icon: Target, count: skillsData.filter(s => s.category === "Management").length },
    { id: "Analytics", label: "Analytics", icon: BarChart3, count: skillsData.filter(s => s.category === "Analytics").length },
    { id: "Tools", label: "Tools", icon: Shield, count: skillsData.filter(s => s.category === "Tools").length }
  ];

  const levels = [
    { id: "all", label: "All Levels" },
    { id: "Beginner", label: "Beginner" },
    { id: "Intermediate", label: "Intermediate" },
    { id: "Advanced", label: "Advanced" }
  ];

  // Filter and sort skills
  const filteredSkills = skillsData
    .filter(skill => {
      const categoryMatch = selectedCategory === "all" || skill.category === selectedCategory;
      const levelMatch = selectedLevel === "all" || skill.level === selectedLevel;
      const searchMatch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && levelMatch && searchMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "importance":
          const importanceOrder = { "High": 3, "Medium": 2, "Low": 1 };
          return importanceOrder[b.importance] - importanceOrder[a.importance];
        case "progress":
          return b.progress - a.progress;
        case "demand":
          const demandOrder = { "Very High": 4, "High": 3, "Medium": 2, "Low": 1 };
          return demandOrder[b.demand] - demandOrder[a.demand];
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case "Very High":
        return "text-red-600";
      case "High":
        return "text-orange-600";
      case "Medium":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
              Required Skills to Learn
            </h1>
            <p className="text-gray-600 mt-2">
              Master the skills needed for your dream internship in the PM Internship Scheme
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Skills</p>
                <p className="text-2xl font-bold text-blue-600">{skillsData.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-green-600">
                  {skillsData.filter(s => s.progress > 0 && s.progress < 100).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-purple-600">
                  {skillsData.filter(s => s.progress === 100).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">
                  {skillsData.filter(s => s.importance === "High").length}
                </p>
              </div>
              <Star className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-2" />
                        {category.label}
                      </div>
                      <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Level</h3>
              <div className="space-y-2">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                      selectedLevel === level.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort by</h3>
              <div className="space-y-2">
                {[
                  { id: "importance", label: "Priority" },
                  { id: "progress", label: "Progress" },
                  { id: "demand", label: "Market Demand" },
                  { id: "name", label: "Name" }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                      sortBy === option.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{skill.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{skill.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImportanceColor(skill.importance)}`}>
                    {skill.importance} Priority
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {skill.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-blue-600">{skill.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(skill.progress)}`}
                  style={{ width: `${skill.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{skill.relatedInternships}</p>
                <p className="text-xs text-gray-600">Related Internships</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getDemandColor(skill.demand)}`}>
                  {skill.demand}
                </p>
                <p className="text-xs text-gray-600">Market Demand</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-center">
              <div>
                <p className="text-lg font-bold text-purple-600">{skill.completionRate}%</p>
                <p className="text-xs text-gray-600">Completion Rate</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-600">{skill.avgSalary}</p>
                <p className="text-xs text-gray-600">Avg. Salary</p>
              </div>
            </div>

            {/* Time Estimate */}
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span>Estimated time: {skill.estimatedTime}</span>
            </div>

            {/* Resources Preview */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Learning Resources</h4>
              <div className="space-y-1">
                {skill.resources.slice(0, 2).map((resource, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Play className="w-3 h-3 mr-2 text-blue-500" />
                      <span className="truncate">{resource.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{resource.duration}</span>
                  </div>
                ))}
                {skill.resources.length > 2 && (
                  <div className="text-xs text-blue-600">
                    +{skill.resources.length - 2} more resources
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </button>
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredSkills.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No skills found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms to see more skills.</p>
        </motion.div>
      )}

      {/* Learning Path Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="text-center">
          <Award className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">AI-Powered Learning Path</h3>
          <p className="text-blue-100 mb-6">
            Based on your profile and PM Internship goals, we recommend this learning sequence:
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {["Digital Literacy", "Communication Skills", "Python Programming", "Project Management"].map((skill, idx) => (
              <span key={idx} className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
              View Full Learning Path
            </button>
            <button className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg font-semibold hover:bg-opacity-30 transition">
              <Zap className="w-4 h-4 mr-2 inline" />
              Start AI-Guided Learning
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}