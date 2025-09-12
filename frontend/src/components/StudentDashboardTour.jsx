import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipForward, SkipBack, X, 
  User, Briefcase, FileText, Bot, Bell, Settings,
  Brain, TrendingUp, MapPin, Star, Upload, BookOpen,
  CheckCircle, Clock, XCircle, AlertCircle, Home,
  Shield, MessageCircle, RefreshCw, Target, BarChart3,
  Calendar, Activity, Globe, Save, ArrowRight,
  ChevronLeft, ChevronRight, Info, Zap, Award
} from 'lucide-react';

const StudentDashboardTour = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tourMode, setTourMode] = useState('guided'); // 'guided', 'explore', 'interactive'
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Comprehensive tour steps covering all dashboard features
  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Your AI-Powered Student Dashboard',
      description: 'Experience the future of internship discovery with our comprehensive, AI-driven platform designed specifically for students.',
      category: 'overview',
      icon: <Home className="w-6 h-6" />,
      visual: 'dashboard-overview',
      features: [
        'AI-powered internship matching',
        'Real-time application tracking',
        'Personalized career guidance',
        'Smart skill development recommendations'
      ],
      interactive: false,
      duration: 3000
    },
    {
      id: 'dashboard-main',
      title: 'Main Dashboard Hub',
      description: 'Your central command center displays key metrics, AI recommendations, and quick actions for seamless navigation.',
      category: 'navigation',
      icon: <BarChart3 className="w-6 h-6" />,
      visual: 'main-dashboard',
      features: [
        'Profile completion tracking',
        'Application statistics',
        'AI match metrics',
        'Saved internships count'
      ],
      interactive: true,
      duration: 4000,
      highlightElements: ['#dashboard-stats', '#ai-recommendations', '#quick-actions']
    },
    {
      id: 'ai-recommendations',
      title: 'AI-Powered Recommendations',
      description: 'Our advanced AI analyzes your profile, skills, and preferences to suggest the most relevant internships.',
      category: 'ai-features',
      icon: <Brain className="w-6 h-6" />,
      visual: 'ai-recommendations',
      features: [
        'Personalized matching algorithm',
        'Real-time preference learning',
        'Smart skill gap analysis',
        'Dynamic recommendation updates'
      ],
      interactive: true,
      duration: 5000,
      demoData: {
        recommendations: [
          { title: 'Digital India Intern', company: 'Ministry of Electronics & IT', match: 95 },
          { title: 'Rural Development Intern', company: 'Ministry of Rural Development', match: 92 },
          { title: 'Skill Development Intern', company: 'Ministry of Skill Development', match: 88 }
        ]
      }
    },
    {
      id: 'profile-management',
      title: 'Comprehensive Profile Management',
      description: 'Build a complete professional profile with skills, experience, education, and preferences.',
      category: 'profile',
      icon: <User className="w-6 h-6" />,
      visual: 'profile-dashboard',
      features: [
        'Multi-language support',
        'Skill assessment integration',
        'Achievement tracking',
        'Professional portfolio builder'
      ],
      interactive: true,
      duration: 4000
    },
    {
      id: 'application-tracking',
      title: 'Advanced Application Analytics',
      description: 'Track all your applications with real-time status updates, interview scheduling, and detailed analytics.',
      category: 'applications',
      icon: <FileText className="w-6 h-6" />,
      visual: 'application-tracking',
      features: [
        'Real-time status tracking',
        'Application timeline visualization',
        'Success rate analytics',
        'Interview preparation tools'
      ],
      interactive: true,
      duration: 4500,
      demoData: {
        applications: [
          { title: 'Frontend Developer', status: 'Interview', progress: 75 },
          { title: 'Data Analyst', status: 'Under Review', progress: 45 },
          { title: 'UI/UX Designer', status: 'Selected', progress: 100 }
        ]
      }
    },
    {
      id: 'ai-chatbot',
      title: 'Intelligent Career Assistant',
      description: 'Get instant career guidance, interview tips, and personalized advice from our AI mentor.',
      category: 'ai-features',
      icon: <Bot className="w-6 h-6" />,
      visual: 'ai-chatbot',
      features: [
        '24/7 career consultation',
        'Interview preparation',
        'Resume optimization tips',
        'Industry insights'
      ],
      interactive: true,
      duration: 3500
    },
    {
      id: 'skill-development',
      title: 'Smart Skill Development',
      description: 'Identify skill gaps and get personalized learning recommendations based on your career goals.',
      category: 'skills',
      icon: <BookOpen className="w-6 h-6" />,
      visual: 'skill-development',
      features: [
        'Skill gap analysis',
        'Personalized learning paths',
        'Industry-relevant courses',
        'Certification tracking'
      ],
      interactive: true,
      duration: 4000
    },
    {
      id: 'notifications',
      title: 'Smart Notification System',
      description: 'Stay updated with intelligent notifications about applications, deadlines, and opportunities.',
      category: 'communication',
      icon: <Bell className="w-6 h-6" />,
      visual: 'notifications',
      features: [
        'Real-time updates',
        'Priority categorization',
        'Customizable preferences',
        'Multi-channel delivery'
      ],
      interactive: true,
      duration: 3000
    },
    {
      id: 'security-features',
      title: 'Advanced Security & Privacy',
      description: 'Your data is protected with enterprise-grade security features and privacy controls.',
      category: 'security',
      icon: <Shield className="w-6 h-6" />,
      visual: 'security-features',
      features: [
        'Bot protection system',
        'Data encryption',
        'Privacy controls',
        'Secure authentication'
      ],
      interactive: true,
      duration: 3500
    },
    {
      id: 'mobile-experience',
      title: 'Seamless Mobile Experience',
      description: 'Access all features on any device with our responsive design and mobile-optimized interface.',
      category: 'mobile',
      icon: <Globe className="w-6 h-6" />,
      visual: 'mobile-experience',
      features: [
        'Responsive design',
        'Touch-optimized interface',
        'Offline capabilities',
        'Cross-platform sync'
      ],
      interactive: false,
      duration: 3000
    }
  ];

  // Tour categories for filtering
  const categories = [
    { id: 'all', name: 'Complete Tour', icon: <Home className="w-4 h-4" />, count: tourSteps.length },
    { id: 'overview', name: 'Overview', icon: <Info className="w-4 h-4" />, count: 1 },
    { id: 'navigation', name: 'Navigation', icon: <MapPin className="w-4 h-4" />, count: 1 },
    { id: 'ai-features', name: 'AI Features', icon: <Brain className="w-4 h-4" />, count: 2 },
    { id: 'profile', name: 'Profile', icon: <User className="w-4 h-4" />, count: 1 },
    { id: 'applications', name: 'Applications', icon: <FileText className="w-4 h-4" />, count: 1 },
    { id: 'skills', name: 'Skills', icon: <BookOpen className="w-4 h-4" />, count: 1 },
    { id: 'communication', name: 'Communication', icon: <MessageCircle className="w-4 h-4" />, count: 1 },
    { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" />, count: 1 },
    { id: 'mobile', name: 'Mobile', icon: <Globe className="w-4 h-4" />, count: 1 }
  ];

  const currentStepData = tourSteps[currentStep];
  const filteredSteps = selectedCategory === 'all' 
    ? tourSteps 
    : tourSteps.filter(step => step.category === selectedCategory);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < tourSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, currentStepData?.duration || 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, currentStepData?.duration]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isPlaying, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsPlaying(false);
    }
  };

  const handleStepSelect = (stepIndex) => {
    setCurrentStep(stepIndex);
    setIsPlaying(false);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const startTour = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const resetTour = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSelectedCategory('all');
  };

  // Visual components for different tour sections
  const renderVisual = () => {
    switch (currentStepData?.visual) {
      case 'dashboard-overview':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Home className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Student Dashboard</h3>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {['AI Matching', 'Real-time Updates', 'Career Guidance', 'Skill Development'].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ai-recommendations':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">AI Recommendations</h3>
            </div>
            {currentStepData.demoData?.recommendations?.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.company}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <Star className="w-4 h-4" />
                    <span className="font-medium">{rec.match}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'application-tracking':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Application Analytics</h3>
            </div>
            {currentStepData.demoData?.applications?.map((app, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{app.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === 'Selected' ? 'bg-green-100 text-green-800' :
                    app.status === 'Interview' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${app.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {currentStepData?.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{currentStepData?.title}</h3>
            <div className="space-y-2">
              {currentStepData?.features?.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Student Dashboard Tour</h1>
                  <p className="text-blue-100">Discover all features of your AI-powered dashboard</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
                <span>Progress</span>
                <span>{currentStep + 1} of {tourSteps.length}</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <motion.div
                  className="bg-white h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              {/* Tour Mode Selector */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tour Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step List */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tour Steps</h3>
                <div className="space-y-2">
                  {filteredSteps.map((step, idx) => (
                    <button
                      key={step.id}
                      onClick={() => handleStepSelect(idx)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition ${
                        currentStep === idx
                          ? 'bg-blue-100 border border-blue-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        currentStep === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {step.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {step.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                {/* Current Step Content */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      {currentStepData?.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentStepData?.title}
                      </h2>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {currentStepData?.description}
                      </p>
                    </div>
                  </div>

                  {/* Visual Component */}
                  <div className="mb-6">
                    {renderVisual()}
                  </div>

                  {/* Feature List */}
                  {currentStepData?.features && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentStepData.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center space-x-3"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              </div>

              {/* Center Info */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Step {currentStep + 1} of {tourSteps.length}</span>
                <div className="w-px h-4 bg-gray-300" />
                <span className="capitalize">{currentStepData?.category}</span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={resetTour}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reset
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStep === tourSteps.length - 1}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700">←</kbd>
                  <span>Previous</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700">→</kbd>
                  <span>Next</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700">Space</kbd>
                  <span>Play/Pause</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentDashboardTour;