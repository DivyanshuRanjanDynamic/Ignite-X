/**
 * Resume Analytics Panel Component
 * Displays comprehensive ATS analysis and recommendations
 */

import React, { useState } from 'react';

const ResumeAnalyticsPanel = ({ isOpen, onClose, analyticsData }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !analyticsData) return null;

  const { overallScore, skillScores, weakSkills, recommendations, atsStatus } = analyticsData;

  /**
   * Get score color based on value
   * @param {number} score - Score value
   * @returns {string} Color class
   */
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  /**
   * Get score label
   * @param {number} score - Score value
   * @returns {string} Score label
   */
  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Resume Analytics & ATS Analysis
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-4 pb-4 sm:p-6">
            {/* Overall Score */}
            <div className="mb-6">
              <div className="text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getScoreColor(overallScore)}`}>
                  Overall ATS Score: {overallScore}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {getScoreLabel(overallScore)} - {atsStatus}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'skills', label: 'Skills Analysis' },
                  { id: 'recommendations', label: 'Recommendations' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Score Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{overallScore}%</div>
                      <div className="text-sm text-blue-800">Overall Score</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Object.keys(skillScores).length}
                      </div>
                      <div className="text-sm text-green-800">Skills Analyzed</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {weakSkills.length}
                      </div>
                      <div className="text-sm text-orange-800">Skills to Improve</div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Strong Skills:</span>
                        <span className="ml-2 font-medium">
                          {Object.entries(skillScores).filter(([_, score]) => score >= 80).length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Average Score:</span>
                        <span className="ml-2 font-medium">
                          {Math.round(Object.values(skillScores).reduce((a, b) => a + b, 0) / Object.values(skillScores).length)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Skills Breakdown</h4>
                  <div className="space-y-3">
                    {Object.entries(skillScores).map(([skill, score]) => (
                      <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{skill}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
                              {score}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Recommendations</h4>
                  <div className="space-y-3">
                    {recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <p className="text-sm text-blue-800">{recommendation}</p>
                      </div>
                    ))}
                  </div>

                  {weakSkills.length > 0 && (
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                      <h5 className="font-medium text-orange-900 mb-2">Priority Skills to Improve</h5>
                      <div className="space-y-2">
                        {weakSkills.map((skill, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-orange-800">{skill.skill}</span>
                            <span className="text-orange-600 font-medium">{skill.score}%</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => window.location.href = '/student/required-skills'}
                          className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 transition-colors"
                        >
                          View Learning Resources
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyticsPanel;
