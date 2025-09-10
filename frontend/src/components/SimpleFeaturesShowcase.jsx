import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  FileText, 
  Upload, 
  Users, 
  Target,
  MessageSquare,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const SimpleFeaturesShowcase = () => {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get personalized internship suggestions based on your skills",
      badge: "Smart"
    },
    {
      icon: Target,
      title: "Skill Matching",
      description: "Match your skills with perfect internship opportunities",
      badge: "Precise"
    },
    {
      icon: FileText,
      title: "Application Tracker",
      description: "Track all your applications in one dashboard",
      badge: "Organized"
    },
    {
      icon: Upload,
      title: "Resume Optimizer",
      description: "AI-powered resume analysis and optimization",
      badge: "Enhanced"
    },
    {
      icon: MessageSquare,
      title: "AI Career Assistant",
      description: "24/7 AI support for career guidance",
      badge: "Always On"
    },
  ];

  return (
    <div className="relative">
      {/* Features Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
      >
        <Sparkles className="w-4 h-4" />
        Features
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Features Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-orange-500 px-6 py-4 text-white">
                <h3 className="text-lg font-bold mb-1">PM Internship AI Features</h3>
                <p className="text-blue-100 text-sm">Powerful tools for your career journey</p>
              </div>

              {/* Features Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {feature.title}
                              </h4>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {feature.badge}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 text-sm"
                    onClick={() => {
                      // Handle navigation to features page or dashboard
                      console.log('Navigate to features');
                    }}
                  >
                    Explore All Features
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimpleFeaturesShowcase;
