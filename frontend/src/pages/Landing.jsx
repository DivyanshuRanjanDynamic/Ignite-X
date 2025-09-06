import { motion } from "framer-motion";
import { 
  Brain, Users, MapPin, Star, ArrowRight, CheckCircle, 
  Target, TrendingUp, Shield, Zap, BookOpen, Briefcase,
  BarChart3, Globe, Smartphone, Award, Clock, UserCheck,
  Calendar, MessageCircle, FileText, Eye, Heart, Share2,
  Play, Download, ExternalLink, Filter, Search, Bell
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  // Sample featured internships aligned with PM Internship Scheme
  const featuredInternships = [
    { 
      id: 1, 
      title: "Digital India Intern", 
      company: "Ministry of Electronics & IT", 
      location: "Remote", 
      stipend: "₹12,000", 
      duration: "3 Months",
      category: "Government",
      match: "95%"
    },
    { 
      id: 2, 
      title: "Rural Development Intern", 
      company: "Ministry of Rural Development", 
      location: "Delhi", 
      stipend: "₹10,000", 
      duration: "6 Months",
      category: "Social Impact",
      match: "92%"
    },
    { 
      id: 3, 
      title: "Skill Development Intern", 
      company: "Ministry of Skill Development", 
      location: "Mumbai", 
      stipend: "₹8,000", 
      duration: "4 Months",
      category: "Education",
      match: "88%"
    },
  ];

  const stats = [
    { number: "50K+", label: "Students Helped", icon: Users, color: "text-blue-600" },
    { number: "500+", label: "Internships Available", icon: Briefcase, color: "text-green-600" },
    { number: "95%", label: "Match Accuracy", icon: Target, color: "text-purple-600" },
    { number: "28", label: "States Covered", icon: MapPin, color: "text-orange-600" }
  ];

  const features = [
    {
      title: "AI-Powered Matching",
      description: "Our intelligent algorithm analyzes your skills, location, and preferences to suggest the most relevant internships from hundreds of available opportunities.",
      icon: Brain,
      color: "blue",
      visual: (
        <div className="relative w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="absolute top-2 left-2 text-xs text-blue-600 font-medium">Match Score</div>
          <div className="absolute top-6 left-2 text-2xl font-bold text-blue-700">95%</div>
          <div className="absolute bottom-2 left-2 text-xs text-blue-500">Perfect Match</div>
          <div className="absolute top-4 right-4 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      )
    },
    {
      title: "System Integration",
      description: "Seamlessly integrates with government portals, educational institutions, and career platforms, ensuring smooth data synchronization and application tracking.",
      icon: Globe,
      color: "purple",
      visual: (
        <div className="relative w-full h-32 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="absolute top-2 left-2 text-xs text-purple-600 font-medium">Connected Platforms</div>
          <div className="flex justify-center items-center h-full">
            <div className="relative">
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-400 rounded-full"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-red-400 rounded-full"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Real-Time Analytics",
      description: "Access up-to-date internship data, application statistics, and success rates anytime, giving you the insights you need for informed career decisions.",
      icon: BarChart3,
      color: "green",
      visual: (
        <div className="relative w-full h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="absolute top-2 left-2 text-xs text-green-600 font-medium">Success Rate</div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex justify-between items-end h-16">
              <div className="w-4 bg-green-400 rounded-t" style={{ height: '60%' }}></div>
              <div className="w-4 bg-green-500 rounded-t" style={{ height: '80%' }}></div>
              <div className="w-4 bg-green-600 rounded-t" style={{ height: '100%' }}></div>
              <div className="w-4 bg-green-500 rounded-t" style={{ height: '70%' }}></div>
              <div className="w-4 bg-green-400 rounded-t" style={{ height: '90%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-green-600 mt-1">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "High-Level Security",
      description: "Your personal data and application information is encrypted using the latest technology, ensuring privacy and security throughout your internship journey.",
      icon: Shield,
      color: "orange",
      visual: (
        <div className="relative w-full h-32 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <div className="absolute top-2 left-2 text-xs text-orange-600 font-medium">Secure</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-10 py-16 md:py-24 gap-10">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
         
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 leading-tight">
            Find Your Perfect <br />
            <span className="text-orange-600">PM Internship</span> Match
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-lg">
            Our AI recommendation engine helps students from rural areas, tribal districts, 
            and remote colleges find the most suitable internships based on their skills, 
            location, and aspirations. No more endless searching!
          </p>
          
          {/* Key Benefits */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>3-5 personalized recommendations</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Works on mobile devices</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Simple, user-friendly interface</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link> 
            <a
              href="#features"
              className="px-8 py-4 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition text-lg font-semibold"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Hero Visual - Overlapping Images Pattern */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0 }}
          className="flex-1 flex justify-center"
        >
          {/* Responsive Image Gallery */}
          <div className="w-full max-w-4xl mx-auto">
            {/* Desktop Layout - Grid */}
            <div className="hidden md:grid md:grid-cols-3 md:grid-rows-2 gap-4 h-[400px]">
              {/* Main Hero Image - Large */}
              <motion.div
                className="md:col-span-2 md:row-span-2 relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img
                  src="/src/assets/hero1.png"
                  alt="AI Recommendation Engine"
                  className="w-full h-full object-cover rounded-2xl shadow-lg border-2 border-white group-hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-700/10 rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-sm font-semibold text-gray-900">AI-Powered Matching</span>
                </div>
              </motion.div>
              
              {/* Top Right */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <img
                  src="/src/assets/hero2.png"
                  alt="Collaborative Learning"
                  className="w-full h-full object-cover rounded-xl shadow-md border-2 border-white group-hover:shadow-lg transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-700/10 rounded-xl"></div>
              </motion.div>
              
              {/* Bottom Right */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, x: 30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <img
                  src="/src/assets/hero3.png"
                  alt="Team Collaboration"
                  className="w-full h-full object-cover rounded-xl shadow-md border-2 border-white group-hover:shadow-lg transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-700/10 rounded-xl"></div>
              </motion.div>
            </div>

            {/* Mobile Layout - Stacked */}
            <div className="md:hidden space-y-4">
              {/* Main Hero Image */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img
                  src="/src/assets/hero1.png"
                  alt="AI Recommendation Engine"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg border-2 border-white group-hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-700/10 rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-sm font-semibold text-gray-900">AI-Powered Matching</span>
                </div>
              </motion.div>
              
              {/* Secondary Images Row */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <img
                    src="/src/assets/hero2.png"
                    alt="Collaborative Learning"
                    className="w-full h-32 object-cover rounded-xl shadow-md border-2 border-white group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-700/10 rounded-xl"></div>
                </motion.div>
                
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <img
                    src="/src/assets/hero3.png"
                    alt="Team Collaboration"
                    className="w-full h-32 object-cover rounded-xl shadow-md border-2 border-white group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-700/10 rounded-xl"></div>
                </motion.div>
              </div>
              
              {/* Third Row */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <img
                    src="/src/assets/hero4.png"
                    alt="Professional Development"
                    className="w-full h-32 object-cover rounded-xl shadow-md border-2 border-white group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-700/10 rounded-xl"></div>
                </motion.div>
                
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  <img
                    src="/src/assets/hero5.png"
                    alt="Learning Environment"
                    className="w-full h-32 object-cover rounded-xl shadow-md border-2 border-white group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-cyan-700/10 rounded-xl"></div>
                </motion.div>
              </div>
            </div>

            {/* Subtle Floating Elements - Desktop Only */}
            <div className="hidden md:block">
              <motion.div
                className="absolute top-8 right-8 w-3 h-3 bg-blue-400 rounded-full shadow-sm"
                animate={{ 
                  y: [0, -8, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-8 left-8 w-2 h-2 bg-purple-400 rounded-full shadow-sm"
                animate={{ 
                  y: [0, 6, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-10 py-12 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section with Image-Type Cards */}
      <section id="features" className="px-6 md:px-10 py-20 bg-gray-50">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
        >
          Why Choose Our AI Recommendation Engine?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Designed specifically for the PM Internship Scheme to help students from all backgrounds
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Visual Section */}
                <div className="mb-6">
                  {feature.visual}
                </div>

                {/* Content Section */}
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <a 
                      href="#" 
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Learn more <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Analytics Dashboard Section */}
      <section className="px-6 md:px-10 py-20 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
        >
          Real-Time Analytics & Insights
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Track your internship journey with comprehensive analytics and personalized insights
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* User Profile & Application Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Student Profile</h3>
                  <p className="text-sm text-gray-500">@student_user</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MessageCircle className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Application Count */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Applications Submitted</div>
            </div>

            {/* Application Status Tabs */}
            <div className="mb-4">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button className="flex-1 py-2 px-3 text-xs font-medium bg-white text-blue-600 rounded-md shadow-sm">
                  Under Review
                </button>
                <button className="flex-1 py-2 px-3 text-xs font-medium text-gray-600">
                  Interview
                </button>
                <button className="flex-1 py-2 px-3 text-xs font-medium text-gray-600">
                  Selected
                </button>
              </div>
            </div>

            {/* Application Status List */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Digital India Intern</span>
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-500">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Rural Development</span>
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-500">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Skill Development</span>
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-500">3</span>
              </div>
            </div>

            {/* Profile Views Chart */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Profile views this week</div>
              <div className="flex items-end space-x-1 h-12">
                <div className="w-3 bg-blue-200 rounded-t" style={{ height: '60%' }}></div>
                <div className="w-3 bg-blue-300 rounded-t" style={{ height: '80%' }}></div>
                <div className="w-3 bg-blue-400 rounded-t" style={{ height: '100%' }}></div>
                <div className="w-3 bg-blue-500 rounded-t" style={{ height: '70%' }}></div>
                <div className="w-3 bg-blue-600 rounded-t" style={{ height: '90%' }}></div>
                <div className="w-3 bg-blue-400 rounded-t" style={{ height: '50%' }}></div>
                <div className="w-3 bg-blue-300 rounded-t" style={{ height: '75%' }}></div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 py-2 px-3 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition">
                View Profile
              </button>
              <button className="px-3 py-2 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition">
                <Share2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

          {/* Application Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Application Activity</h3>
                <p className="text-sm text-gray-500">From 15 Nov - 15 Dec, 2024</p>
              </div>
              <button className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-200 transition">
                Change Period
              </button>
            </div>

            {/* Activity Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-xs text-gray-600">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-xs text-gray-600">Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-xs text-gray-600">Selected</div>
              </div>
            </div>

            {/* Activity Calendar */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Activity Calendar</div>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-center text-xs text-gray-500 py-1">{day}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    i % 7 === 0 || i % 7 === 6 ? 'bg-gray-100' : 
                    i % 3 === 0 ? 'bg-purple-100 text-purple-600' : 
                    'bg-gray-50 text-gray-400'
                  }`}>
                    {i > 6 && i < 35 ? i - 6 : ''}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500 mb-2">Recent Activity</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Application submitted to Digital India</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Interview scheduled for Rural Development</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Profile updated with new skills</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Success Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Success Insights</h3>
                <p className="text-sm text-gray-500">Posted on Dec 10, 2024 - 2:30pm</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Success Metrics */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Applications Success Rate</div>
                  <div className="text-2xl font-bold text-green-600">85%</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Interview Conversion</div>
                  <div className="text-2xl font-bold text-blue-600">+12%</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Success Rate Trend</div>
              <div className="flex items-end space-x-1 h-16">
                <div className="w-4 bg-gray-200 rounded-t" style={{ height: '40%' }}></div>
                <div className="w-4 bg-gray-300 rounded-t" style={{ height: '60%' }}></div>
                <div className="w-4 bg-blue-400 rounded-t" style={{ height: '80%' }}></div>
                <div className="w-4 bg-green-500 rounded-t" style={{ height: '100%' }}></div>
                <div className="w-4 bg-green-600 rounded-t" style={{ height: '90%' }}></div>
                <div className="w-4 bg-green-500 rounded-t" style={{ height: '85%' }}></div>
              </div>
            </div>

            {/* Unique Finding */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="text-xs font-medium text-blue-800 mb-1">Unique Finding</div>
              <div className="text-xs text-blue-700">
                You have higher success rates when applying to government internships. 
                Your profile matches well with PM Internship Scheme requirements!
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
              View Detailed Analytics
            </button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 md:px-10 py-20 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
        >
          How Our AI Recommendation Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Simple steps to get your personalized internship recommendations
        </motion.p>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Tell us about your education, skills, location, and career interests",
                icon: UserCheck,
                color: "blue"
              },
              {
                step: "02", 
                title: "AI Analysis",
                description: "Our algorithm analyzes your profile against hundreds of internship opportunities",
                icon: Brain,
                color: "purple"
              },
              {
                step: "03",
                title: "Get Recommendations",
                description: "Receive 3-5 personalized internship recommendations with match percentages",
                icon: Target,
                color: "green"
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`w-20 h-20 bg-${step.color}-100 rounded-full flex items-center justify-center mx-auto mb-6 relative`}>
                    <Icon className={`w-10 h-10 text-${step.color}-600`} />
                    <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${step.color}-600 text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="px-6 md:px-10 py-20 bg-blue-50">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
        >
          Featured Internships
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Discover exciting opportunities in the PM Internship Scheme
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {featuredInternships.map((internship, index) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Simple Header */}
              <div className="bg-blue-600 text-white p-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-semibold">PM Internship Scheme</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-2 py-1 rounded">
                    <Star className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs font-semibold">{internship.match}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title and Department */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                {internship.title}
              </h3>
                  <p className="text-gray-600 font-medium">{internship.company}</p>
                </div>

                {/* Basic Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{internship.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{internship.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Award className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-semibold text-gray-900">{internship.stipend}</span>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {internship.category}
                  </span>
                </div>

                {/* Action Button */}
              <Link
                  to="/register"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
              </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/internships"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            View All Internships
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Interactive Tools Section */}
      <section className="px-6 md:px-10 py-20 bg-gray-50">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
        >
          Interactive Tools & Resources
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Access powerful tools to enhance your internship application journey
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Resume Builder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume ATS Tracker</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create ATS-optimized resumes with our AI-powered builder
            </p>

            {/* Progress Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress Indicator</span>
                <span>75%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">3</div>
                <div className="text-xs text-gray-500">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">95%</div>
                <div className="text-xs text-gray-500">ATS Score</div>
              </div>
            </div>

            <button className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
              Build Resume
            </button>
          </motion.div>

          {/* Skill Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Play className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Skill Assessment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Evaluate your skills and get personalized improvement recommendations
            </p>

            {/* Skill Levels */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Digital Literacy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Communication</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-10 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">62%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Project Management</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">50%</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2 px-4 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition">
              Take Assessment
            </button>
          </motion.div>

         

          {/* Career Guidance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Guidance</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get personalized career advice and roadmap recommendations
            </p>

            {/* AI Insights */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <div className="text-xs font-medium text-orange-800 mb-1">AI Insight</div>
              <div className="text-xs text-orange-700">
                Based on your profile, consider focusing on government sector internships for better success rates.
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">Improve digital skills</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">Add project experience</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">Network with professionals</span>
              </div>
            </div>

            <button className="w-full py-2 px-4 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition">
              Get Guidance
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-10 py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Internship?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of students who have found their dream internships through our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center justify-center"
            >
              Get Started 
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">Ignite-X</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered internship recommendation engine for the PM Internship Scheme, 
                helping students across India find their perfect career opportunities.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>How It Works</li>
                <li>Features</li>
                <li>Success Stories</li>
                <li>Help Center</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Regional Language Support</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>Accessibility</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Ignite-X AI Recommendation Engine. All rights reserved.</p>
            <p className="mt-2 text-sm">Designed for the PM Internship Scheme - Bridging opportunities across India</p>
            
           
            
          </div>
        </div>
      </footer>
    </div>
  );
}