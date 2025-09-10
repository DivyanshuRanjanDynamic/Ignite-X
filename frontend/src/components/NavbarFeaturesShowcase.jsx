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
import { useNavigate } from 'react-router-dom';

const NavbarFeaturesShowcase = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get personalized internship suggestions based on your skills",
      badge: "Smart",
      link: "/student-dashboard/recommended-internships"
    },
    {
      icon: Target,
      title: "Skill Matching",
      description: "Match your skills with perfect internship opportunities",
      badge: "Precise",
      link: "/student-dashboard/required-skills"
    },
    {
      icon: FileText,
      title: "Application Tracker",
      description: "Track all your applications in one dashboard",
      badge: "Organized",
      link: "/student-dashboard/applied-internships"
    },
    {
      icon: Upload,
      title: "Resume Optimizer",
      description: "AI-powered resume analysis and optimization",
      badge: "Enhanced",
      link: "/student-dashboard/resume-upload"
    },
    
  ];

  const handleFeatureClick = (feature) => {
    setIsOpen(false);
    if (feature.link) {
      navigate(feature.link);
    }
  };

  const handleExploreAll = () => {
    setIsOpen(false);
    navigate('/register');
  };

  return (
    <div className="relative">
      {/* Features Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-white hover:text-gray-200 transition-colors rounded-lg hover:bg-blue-700 font-medium"
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
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
             

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
                        onClick={() => handleFeatureClick(feature)}
                        className="group p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                {feature.title}
                              </h4>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarFeaturesShowcase;
