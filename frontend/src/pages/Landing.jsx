import { motion } from "framer-motion";
import { 
  Brain, Users, MapPin, Star, ArrowRight, CheckCircle, 
  Target, TrendingUp, Shield, Zap, BookOpen, Briefcase,
  BarChart3, Globe, Smartphone, Award, Clock, UserCheck,
  Calendar, MessageCircle, FileText, Eye, Heart, Share2,
  Play, Download, ExternalLink, Filter, Search, Bell,
  Bookmark, DollarSign, ChevronUp,
  Bubbles
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLandingTranslation } from '../hooks/useTranslation.jsx';
import Navbar from "../components/Navbar";
import FeaturesShowcase from "../components/FeaturesShowcase";

export default function LandingPage() {
  const { t, tCommon } = useLandingTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [featuresShowcaseOpen, setFeaturesShowcaseOpen] = useState(false);

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
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
      match: "95%",
      matchBadge: "Excellent Match",
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
      match: "92%",
      matchBadge: "Excellent Match",
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
      match: "88%",
      matchBadge: "Good Match",
      description: "Support skill development programs and vocational training initiatives.",
      skills: ["Teaching", "Training", "Education"]
    },
  ];

  const stats = [
    { number: "50K+", label: t('stats.studentsHelped'), icon: Users, color: "text-blue-600" },
    { number: "500+", label: t('stats.internshipsAvailable'), icon: Briefcase, color: "text-green-600" },
    { number: "95%", label: t('stats.matchAccuracy'), icon: Target, color: "text-purple-600" },
    { number: "28", label: t('stats.statesCovered'), icon: MapPin, color: "text-orange-600" }
  ];

  const features = [
    {
      title: t('features.aiMatching.title'),
      description: t('features.aiMatching.description'),
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
      title: t('features.systemIntegration.title'),
      description: t('features.systemIntegration.description'),
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
      title: t('features.realTimeAnalytics.title'),
      description: t('features.realTimeAnalytics.description'),
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
      title: t('features.highLevelSecurity.title'),
      description: t('features.highLevelSecurity.description'),
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
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-24 gap-8 lg:gap-12">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
         
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-700 leading-tight">
            {t('hero.title')} <br className="hidden sm:block" />
            <span className="text-orange-600">{t('hero.titleHighlight')}</span> {t('hero.titleEnd')}
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto lg:mx-0">
            {t('hero.subtitle')}
          </p>
          
          {/* Key Benefits */}
          <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
            <div className="flex items-center text-gray-700 justify-center lg:justify-start">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">{t('hero.benefits.personalizedRecommendations')}</span>
            </div>
            <div className="flex items-center text-gray-700 justify-center lg:justify-start">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">{t('hero.benefits.mobileCompatible')}</span>
            </div>
            <div className="flex items-center text-gray-700 justify-center lg:justify-start">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">{t('hero.benefits.userFriendly')}</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/register"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-blue-600 text-white text-base sm:text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
            >
              {t('hero.getStarted')}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
            <a
              href="#features"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition text-base sm:text-lg font-semibold text-center"
            >
              {t('hero.seeHowItWorks')}
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
                  src="/assets/hero1.png"
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
                  src="/assets/hero2.png"
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
                  src="/assets/hero6.png"
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
                  src="/assets/hero1.png"
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
                    src="/assets/hero2.png"
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
                    src="/assets/hero3.png"
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
                    src="/assets/hero4.png"
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
                    src="/assets/hero5.png"
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
      <section className="px-4 sm:px-6 md:px-10 py-8 sm:py-12 bg-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
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
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                </div>
                <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-600 mt-1 text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive Features Showcase Section */}
      <section className="px-4 sm:px-6 md:px-10 py-16 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Discover Our Powerful AI Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 mb-12 max-w-3xl mx-auto text-lg"
          >
            Experience the comprehensive suite of AI-powered tools designed to accelerate your internship journey and career growth.
          </motion.p>
          
          {/* Features Showcase Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <FeaturesShowcase 
              isOpen={featuresShowcaseOpen} 
              onToggle={() => setFeaturesShowcaseOpen(!featuresShowcaseOpen)} 
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-sm text-gray-500 mt-8"
          >
            Click the features button above to explore our comprehensive toolkit
          </motion.p>
        </div>
      </section>

      {/* Features Section with Image-Type Cards */}
      <section id="features" className="px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 bg-gray-50">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
        >
          {t('sections.featuresTitle')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-8 sm:mb-12 md:mb-14 max-w-2xl mx-auto text-sm sm:text-base"
        >
          {t('sections.featuresSubtitle')}
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
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
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Visual Section */}
                <div className="mb-4 sm:mb-6">
                  {feature.visual}
                </div>

                {/* Content Section */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${feature.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                      {feature.description}
                    </p>
                    <a 
                      href="#" 
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                     learn more <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Analytics Dashboard Section */}
      <section className="px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
        >
          {t('sections.analyticsTitle')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-8 sm:mb-12 md:mb-14 max-w-2xl mx-auto text-sm sm:text-base"
        >
          {t('sections.analyticsSubtitle')}
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {/* User Profile & Application Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('analytics.studentProfile')}</h3>
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
              <div className="text-sm text-gray-600">{t('analytics.applicationsSubmitted')}</div>
            </div>

            {/* Application Status Tabs */}
            <div className="mb-4">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button className="flex-1 py-2 px-3 text-xs font-medium bg-white text-blue-600 rounded-md shadow-sm">
                  {t('analytics.underReview')}
                </button>
                <button className="flex-1 py-2 px-3 text-xs font-medium text-gray-600">
                  {t('analytics.interview')}
                </button>
                <button className="flex-1 py-2 px-3 text-xs font-medium text-gray-600">
                  {t('analytics.selected')}
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
              <div className="text-xs text-gray-500 mb-2">{t('analytics.profileViewsWeek')}</div>
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
                {t('analytics.viewProfile')}
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
                <h3 className="font-semibold text-gray-900">{t('analytics.applicationActivity')}</h3>
                <p className="text-sm text-gray-500">From 15 Nov - 15 Dec, 2024</p>
              </div>
              <button className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-200 transition">
                {t('analytics.changePeriod')}
              </button>
            </div>

            {/* Activity Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-xs text-gray-600">{t('analytics.applications')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-xs text-gray-600">{t('analytics.interviews')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-xs text-gray-600">{t('analytics.selected')}</div>
              </div>
            </div>

            {/* Activity Calendar */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">{t('analytics.activityCalendar')}</div>
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
              <div className="text-xs text-gray-500 mb-2">{t('analytics.recentActivity')}</div>
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
                <h3 className="font-semibold text-gray-900">{t('analytics.successInsights')}</h3>
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
                  <div className="text-sm text-gray-600">{t('analytics.applicationSuccessRate')}</div>
                  <div className="text-2xl font-bold text-green-600">85%</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">{t('analytics.interviewConversion')}</div>
                  <div className="text-2xl font-bold text-blue-600">+12%</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">{t('analytics.successRateTrend')}</div>
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
              <div className="text-xs font-medium text-blue-800 mb-1">{t('analytics.uniqueFinding')}</div>
              <div className="text-xs text-blue-700">
                {t('analytics.uniqueFindingText')}
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
              {t('analytics.viewDetailedAnalytics')}
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
          {t('sections.howItWorksTitle')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          {t('sections.howItWorksSubtitle')}
        </motion.p>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: t('howItWorks.steps.step1.title'),
                description: t('howItWorks.steps.step1.description'),
                icon: UserCheck,
                color: "blue"
              },
              {
                step: "02", 
                title: t('howItWorks.steps.step2.title'),
                description: t('howItWorks.steps.step2.description'),
                icon: Brain,
                color: "purple"
              },
              {
                step: "03",
                title: t('howItWorks.steps.step3.title'),
                description: t('howItWorks.steps.step3.description'),
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
          {t('sections.featuredInternshipsTitle')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          {t('sections.featuredInternshipsSubtitle')}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featuredInternships.map((internship, index) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Card Content */}
              <div className="p-6">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                {internship.title}
              </h3>
                      <p className="text-gray-600 text-sm mb-3">{internship.company}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{internship.match}</span>
                    </div>
                  </div>
                  
                  {/* Match Badge */}
                  <div className="mb-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      internship.matchBadge === "Excellent Match" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {internship.matchBadge}
                    </span>
                  </div>
                </div>

                {/* Details Section with Icons */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-3 text-red-500" />
                    <span className="text-sm">{internship.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-4 h-4 mr-3 text-blue-500" />
                    <span className="text-sm">{internship.category}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-3 text-green-500" />
                    <span className="text-sm">{internship.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="w-4 h-4 mr-3 text-orange-500" />
                    <span className="text-sm font-medium">{internship.stipend}/month</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {internship.description}
                  </p>
                </div>

                {/* Required Skills */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
              <Link
                    to="/register"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold text-center"
              >
                    {t('internships.apply')}
              </Link>
                  <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <Bookmark className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <Eye className="w-4 h-4 text-green-600" />
                  </button>
                </div>
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
            {t('internships.viewAll')}
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
          {t('sections.interactiveToolsTitle')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          {t('sections.interactiveToolsSubtitle')}
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

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('tools.resumeBuilder.title')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('tools.resumeBuilder.description')}
            </p>

            {/* Progress Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{t('tools.resumeBuilder.progressIndicator')}</span>
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
                <div className="text-xs text-gray-500">{t('tools.resumeBuilder.templates')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">95%</div>
                <div className="text-xs text-gray-500">{t('tools.resumeBuilder.atsScore')}</div>
              </div>
            </div>

            <button className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
              {t('tools.resumeBuilder.buildResume')}
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

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('tools.skillAssessment.title')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('tools.skillAssessment.description')}
            </p>

            {/* Skill Levels */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t('tools.skillAssessment.digitalLiteracy')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t('tools.skillAssessment.communication')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-10 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">62%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t('tools.skillAssessment.projectManagement')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">50%</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2 px-4 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition">
              {t('tools.skillAssessment.takeAssessment')}
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

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('tools.careerGuidance.title')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('tools.careerGuidance.description')}
            </p>

            {/* AI Insights */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <div className="text-xs font-medium text-orange-800 mb-1">{t('tools.careerGuidance.aiInsight')}</div>
              <div className="text-xs text-orange-700">
                {t('tools.careerGuidance.aiInsightText')}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">{t('tools.careerGuidance.improveDigitalSkills')}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">{t('tools.careerGuidance.addProjectExperience')}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">{t('tools.careerGuidance.networkProfessionals')}</span>
              </div>
            </div>

            <button className="w-full py-2 px-4 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition">
              {t('tools.careerGuidance.getGuidance')}
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
                <Bubbles className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">Ignite-X</span>
              </div>
              <p className="text-gray-400 mb-4">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.platform.title')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{t('footer.platform.howItWorks')}</li>
                <li>{t('footer.platform.features')}</li>
                <li>{t('footer.platform.successStories')}</li>
                <li>{t('footer.platform.helpCenter')}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.support.title')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{t('footer.support.helpCenter')}</li>
                <li>{t('footer.support.contactUs')}</li>
                <li>{t('footer.support.languageSupport')}</li>
                <li>{t('footer.support.faq')}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.legal.title')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{t('footer.legal.privacyPolicy')}</li>
                <li>{t('footer.legal.termsOfService')}</li>
                <li>{t('footer.legal.cookiePolicy')}</li>
                <li>{t('footer.legal.accessibility')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
           
            <p className="mt-2 text-sm">© 2025 Ignite-X AI Recommendation Engine. All rights reserved.

Designed for the PM Internship Scheme - Bridging opportunities across India</p>
            
           
            
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5 group-hover:animate-bounce" />
        </motion.button>
      )}
    </div>
  );
}
