/**
 * Required Skills Page
 * Displays skills that need improvement with learning resources
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RequiredSkillsGrid from '../../components/resume/RequiredSkillsGrid.jsx';

const RequiredSkills = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Required Skills
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Based on your resume analysis, here are the skills you should focus on improving. 
              Each skill includes curated learning resources to help you grow.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Learning Resources</p>
                <p className="text-2xl font-bold text-gray-900">Curated</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Target Score</p>
                <p className="text-2xl font-bold text-gray-900">90%+</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progress Tracking</p>
                <p className="text-2xl font-bold text-gray-900">Available</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RequiredSkillsGrid />
        </motion.div>

        {/* Footer Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-blue-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            💡 Learning Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Focus on One Skill at a Time</h4>
              <p>Master one skill before moving to the next. This approach leads to better retention and deeper understanding.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Practice Regularly</h4>
              <p>Consistent practice is key to skill development. Set aside dedicated time each week for learning.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Apply What You Learn</h4>
              <p>Practice the skills in real projects or scenarios to reinforce your learning.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Update Your Resume</h4>
              <p>After gaining proficiency, update your resume to reflect your new skills and improve your ATS scores.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RequiredSkills;