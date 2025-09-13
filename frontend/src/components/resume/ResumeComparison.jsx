import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { compareResumes } from '../../api/resumes';
import { ArrowUpDown, Check, X, TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Resume Comparison Component
 * Allows users to compare two resume versions and see differences
 */
const ResumeComparison = ({ userResumes = [] }) => {
  const [firstResumeId, setFirstResumeId] = useState('');
  const [secondResumeId, setSecondResumeId] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle resume comparison
  const handleCompare = async () => {
    if (!firstResumeId || !secondResumeId) {
      toast.error('Please select two resumes to compare');
      return;
    }

    if (firstResumeId === secondResumeId) {
      toast.error('Please select different resumes to compare');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await compareResumes(firstResumeId, secondResumeId);
      if (response.success) {
        setComparisonData(response.data);
        toast.success('Resume comparison completed');
      } else {
        setError(response.error?.message || 'Failed to compare resumes');
        toast.error(response.error?.message || 'Failed to compare resumes');
      }
    } catch (err) {
      console.error('Resume comparison error:', err);
      setError('Failed to compare resumes. Please try again.');
      toast.error('Failed to compare resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Get color based on score difference
  const getDifferenceColor = (diff) => {
    if (diff > 0) return 'text-green-600';
    if (diff < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Get icon based on score difference
  const getDifferenceIcon = (diff) => {
    if (diff > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (diff < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ArrowUpDown className="w-5 h-5" /> Resume Version Comparison
      </h2>

      {/* Resume Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Resume (Earlier Version)
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={firstResumeId}
            onChange={(e) => setFirstResumeId(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a resume</option>
            {userResumes.map((resume) => (
              <option key={`first-${resume.id}`} value={resume.id}>
                {resume.originalName} ({formatDate(resume.uploadedAt)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Second Resume (Later Version)
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={secondResumeId}
            onChange={(e) => setSecondResumeId(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a resume</option>
            {userResumes.map((resume) => (
              <option key={`second-${resume.id}`} value={resume.id}>
                {resume.originalName} ({formatDate(resume.uploadedAt)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Compare Button */}
      <div className="flex justify-center mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          onClick={handleCompare}
          disabled={loading || !firstResumeId || !secondResumeId}
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>Comparing...</span>
            </>
          ) : (
            <>
              <ArrowUpDown className="w-4 h-4" />
              <span>Compare Resumes</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Comparison Results */}
      {comparisonData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-medium">Basic Information</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div></div>
                <div className="text-center font-medium text-gray-700">
                  First Resume
                </div>
                <div className="text-center font-medium text-gray-700">
                  Second Resume
                </div>

                <div className="text-gray-700">Filename</div>
                <div className="text-center">{comparisonData.basic.firstResume.filename}</div>
                <div className="text-center">{comparisonData.basic.secondResume.filename}</div>

                <div className="text-gray-700">Upload Date</div>
                <div className="text-center">{formatDate(comparisonData.basic.firstResume.uploadedAt)}</div>
                <div className="text-center">{formatDate(comparisonData.basic.secondResume.uploadedAt)}</div>

                <div className="text-gray-700">File Size</div>
                <div className="text-center">{formatFileSize(comparisonData.basic.firstResume.fileSize)}</div>
                <div className="text-center">{formatFileSize(comparisonData.basic.secondResume.fileSize)}</div>
              </div>
            </div>
          </div>

          {/* ATS Score Comparison */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-medium">ATS Score Comparison</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-gray-500 text-sm">First Resume</div>
                  <div className="text-3xl font-bold">{comparisonData.atsScores.firstResume}%</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    {getDifferenceIcon(comparisonData.atsScores.difference)}
                    <span className={`font-bold ${getDifferenceColor(comparisonData.atsScores.difference)}`}>
                      {comparisonData.atsScores.difference > 0 ? '+' : ''}
                      {comparisonData.atsScores.difference}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {comparisonData.atsScores.improvement ? 'Improved' : 'Decreased'}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-gray-500 text-sm">Second Resume</div>
                  <div className="text-3xl font-bold">{comparisonData.atsScores.secondResume}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Comparison */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-medium">Skills Comparison</h3>
            </div>
            <div className="p-4">
              {/* Improved Skills */}
              {comparisonData.skillScores.improved.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-green-700 flex items-center gap-1 mb-2">
                    <TrendingUp className="w-4 h-4" /> Improved Skills
                  </h4>
                  <div className="bg-green-50 rounded-md p-3">
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="font-medium">Skill</div>
                      <div className="font-medium text-center">First Score</div>
                      <div className="font-medium text-center">Second Score</div>
                      <div className="font-medium text-center">Difference</div>

                      {comparisonData.skillScores.improved.map((skill, index) => (
                        <React.Fragment key={`improved-${index}`}>
                          <div>{skill.skill}</div>
                          <div className="text-center">{skill.firstScore}%</div>
                          <div className="text-center">{skill.secondScore}%</div>
                          <div className="text-center text-green-600">+{skill.difference}%</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Declined Skills */}
              {comparisonData.skillScores.declined.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-red-700 flex items-center gap-1 mb-2">
                    <TrendingDown className="w-4 h-4" /> Declined Skills
                  </h4>
                  <div className="bg-red-50 rounded-md p-3">
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="font-medium">Skill</div>
                      <div className="font-medium text-center">First Score</div>
                      <div className="font-medium text-center">Second Score</div>
                      <div className="font-medium text-center">Difference</div>

                      {comparisonData.skillScores.declined.map((skill, index) => (
                        <React.Fragment key={`declined-${index}`}>
                          <div>{skill.skill}</div>
                          <div className="text-center">{skill.firstScore}%</div>
                          <div className="text-center">{skill.secondScore}%</div>
                          <div className="text-center text-red-600">{skill.difference}%</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* New Skills */}
              {comparisonData.skillScores.new.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-blue-700 flex items-center gap-1 mb-2">
                    <Plus className="w-4 h-4" /> New Skills
                  </h4>
                  <div className="bg-blue-50 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Skill</div>
                      <div className="font-medium text-center">Score</div>

                      {comparisonData.skillScores.new.map((skill, index) => (
                        <React.Fragment key={`new-${index}`}>
                          <div>{skill.skill}</div>
                          <div className="text-center">{skill.score}%</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Removed Skills */}
              {comparisonData.skillScores.removed.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                    <X className="w-4 h-4" /> Removed Skills
                  </h4>
                  <div className="bg-gray-100 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Skill</div>
                      <div className="font-medium text-center">Previous Score</div>

                      {comparisonData.skillScores.removed.map((skill, index) => (
                        <React.Fragment key={`removed-${index}`}>
                          <div>{skill.skill}</div>
                          <div className="text-center">{skill.score}%</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Unchanged Skills */}
              {comparisonData.skillScores.unchanged.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                    <Minus className="w-4 h-4" /> Unchanged Skills
                  </h4>
                  <div className="bg-gray-50 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Skill</div>
                      <div className="font-medium text-center">Score</div>

                      {comparisonData.skillScores.unchanged.map((skill, index) => (
                        <React.Fragment key={`unchanged-${index}`}>
                          <div>{skill.skill}</div>
                          <div className="text-center">{skill.score}%</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Difference */}
          {comparisonData.textDifference && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="font-medium">Text Content Comparison</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-1">Word Count</div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-gray-500 text-xs">First:</span>{' '}
                        <span className="font-medium">{comparisonData.textDifference.firstWordCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Second:</span>{' '}
                        <span className="font-medium">{comparisonData.textDifference.secondWordCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Difference:</span>{' '}
                        <span className={`font-medium ${getDifferenceColor(comparisonData.textDifference.wordCountDiff)}`}>
                          {comparisonData.textDifference.wordCountDiff > 0 ? '+' : ''}
                          {comparisonData.textDifference.wordCountDiff} ({comparisonData.textDifference.wordCountPercentage}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-1">Content Changes</div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-gray-500 text-xs">New Words:</span>{' '}
                        <span className="font-medium text-blue-600">{comparisonData.textDifference.newUniqueWords}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Removed Words:</span>{' '}
                        <span className="font-medium text-gray-600">{comparisonData.textDifference.removedUniqueWords}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Change %:</span>{' '}
                        <span className="font-medium">{comparisonData.textDifference.contentChangePercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeComparison;