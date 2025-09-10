import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Briefcase, 
  FileText, 
  BookOpen, 
  Upload, 
  Users, 
  Target,
  TrendingUp,
  MessageSquare,
  Calendar,
  Award,
  ChevronDown,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';

const FeaturesShowcase = ({ isOpen, onToggle }) => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get personalized internship suggestions based on your skills and preferences",
      badge: "Smart",
      color: "blue"
    },
    {
      icon: Target,
      title: "Skill Matching",
      description: "Match your skills with the perfect internship opportunities",
      badge: "Precise",
      color: "green"
    },
    {
      icon: FileText,
      title: "Application Tracker",
      description: "Track all your applications in one centralized dashboard",
      badge: "Organized",
      color: "purple"
    },
    {
      icon: Upload,
      title: "Resume Optimizer",
      description: "AI-powered resume analysis and optimization suggestions",
      badge: "Enhanced",
      color: "orange"
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        badge: "bg-blue-100 text-blue-800",
        border: "border-blue-200",
        hover: "hover:bg-blue-100"
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        badge: "bg-green-100 text-green-800",
        border: "border-green-200",
        hover: "hover:bg-green-100"
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        badge: "bg-purple-100 text-purple-800",
        border: "border-purple-200",
        hover: "hover:bg-purple-100"
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        badge: "bg-orange-100 text-orange-800",
        border: "border-orange-200",
        hover: "hover:bg-orange-100"
      },
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        badge: "bg-indigo-100 text-indigo-800",
        border: "border-indigo-200",
        hover: "hover:bg-indigo-100"
      },
      pink: {
        bg: "bg-pink-50",
        text: "text-pink-600",
        badge: "bg-pink-100 text-pink-800",
        border: "border-pink-200",
        hover: "hover:bg-pink-100"
      },
      teal: {
        bg: "bg-teal-50",
        text: "text-teal-600",
        badge: "bg-teal-100 text-teal-800",
        border: "border-teal-200",
        hover: "hover:bg-teal-100"
      },
      yellow: {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        badge: "bg-yellow-100 text-yellow-800",
        border: "border-yellow-200",
        hover: "hover:bg-yellow-100"
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="relative">
      {/* Features Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-gray-700"
      >
        <Sparkles className="w-5 h-5 text-blue-600" />
        Features
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Features Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 mt-2 w-[900px] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-orange-500 px-8 py-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="p-8">
                <div className="grid grid-cols-3 gap-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const colors = getColorClasses(feature.color);
                    
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className={`group cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${colors.bg} ${colors.border} ${colors.hover} hover:shadow-lg hover:scale-105`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.text} bg-white shadow-sm border border-gray-100`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm group-hover:text-gray-800">
                                {feature.title}
                              </h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
                                {feature.badge}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed group-hover:text-gray-700">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      Available 24/7 for all registered students
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Explore All Features
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturesShowcase;
