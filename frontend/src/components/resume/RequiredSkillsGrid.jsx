/**
 * Required Skills Grid Component
 * Displays skills that need improvement with YouTube learning links
 */

import React, { useState, useEffect } from 'react';
import { getRequiredSkills } from '../../api/resumes.js';
import { toast } from 'react-hot-toast';

const RequiredSkillsGrid = () => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load required skills on component mount
   */
  useEffect(() => {
    loadRequiredSkills();
  }, []);

  /**
   * Load required skills from API
   */
  const loadRequiredSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getRequiredSkills();
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error('Failed to load required skills:', error);
      setError('Failed to load required skills');
      toast.error('Failed to load required skills');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle start learning button click
   * @param {Object} skill - Skill object with YouTube link
   */
  const handleStartLearning = (skill) => {
    if (skill.youtubeLink?.url) {
      window.open(skill.youtubeLink.url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Learning resource not available for this skill');
    }
  };

  /**
   * Get proficiency color based on score
   * @param {number} score - Skill score
   * @returns {string} Color class
   */
  const getProficiencyColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  /**
   * Get proficiency level text
   * @param {number} score - Skill score
   * @returns {string} Proficiency level
   */
  const getProficiencyLevel = (score) => {
    if (score >= 90) return 'Expert';
    if (score >= 70) return 'Intermediate';
    if (score >= 50) return 'Beginner';
    return 'Novice';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button
          onClick={loadRequiredSkills}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Great Job!</h3>
        <p className="text-gray-600">
          Your resume shows strong skills across all areas. No specific improvements needed at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Skills to Improve
        </h2>
        <p className="text-gray-600">
          Based on your resume analysis, here are skills that could be strengthened
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* Skill Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {skill.skill}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.currentScore)}`}
              >
                {getProficiencyLevel(skill.currentScore)}
              </span>
            </div>

            {/* Skill Description */}
            <p className="text-gray-600 text-sm mb-4">
              {skill.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Current: {skill.currentScore}%</span>
                <span>Target: {skill.targetScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${skill.currentScore}%` }}
                ></div>
              </div>
            </div>

            {/* YouTube Link */}
            {skill.youtubeLink ? (
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Recommended Learning:</span>
                </div>
                <p className="text-sm font-medium text-gray-800 mb-1">
                  {skill.youtubeLink.title}
                </p>
                <p className="text-xs text-gray-500">
                  by {skill.youtubeLink.channel}
                </p>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Learning resource coming soon for this skill.
                </p>
              </div>
            )}

            {/* Start Learning Button */}
            <button
              onClick={() => handleStartLearning(skill)}
              disabled={!skill.youtubeLink?.url}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Start Learning</span>
            </button>
          </div>
        ))}
      </div>

      {/* Footer Message */}
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 text-sm">
          💡 <strong>Tip:</strong> Focus on one skill at a time and practice regularly. 
          Update your resume after gaining proficiency to improve your ATS scores.
        </p>
      </div>
    </div>
  );
};

export default RequiredSkillsGrid;
