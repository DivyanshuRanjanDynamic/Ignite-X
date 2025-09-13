/**
 * Resume API Service V2
 * Handles enhanced resume upload, ATS scoring, and management
 */

import api from './client.js';

/**
 * Upload resume with ATS scoring
 * @param {File} file - Resume file
 * @returns {Promise<Object>} Upload result with ATS scores
 */
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Get resume preview URL
 * @param {string} resumeId - Resume ID
 * @returns {Promise<Object>} Preview data
 */
export const getResumePreview = async (resumeId) => {
  const response = await api.get(`resumes/${resumeId}/preview`);
  return response.data;
};

/**
 * Download resume
 * @param {string} resumeId - Resume ID
 * @param {string} type - Download type ('original' or 'ats_template')
 * @returns {Promise<Object>} Download URL
 */
export const downloadResume = async (resumeId, type = 'original') => {
  const response = await api.get(`resumes/${resumeId}/download`, {
    params: { type },
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Get resume analytics and ATS scores
 * @param {string} resumeId - Resume ID
 * @returns {Promise<Object>} Analytics data
 */
export const getResumeAnalytics = async (resumeId) => {
  const response = await api.get(`resumes/${resumeId}/analytics`);
  return response.data;
};

/**
 * Request professional review for resume
 * @param {string} resumeId - Resume ID
 * @returns {Promise<Object>} Review request result
 */
export const requestReview = async (resumeId) => {
  const response = await api.post(`resumes/${resumeId}/request_review`);
  return response.data;
};

/**
 * Get required skills based on ATS analysis
 * @returns {Promise<Object>} Required skills data
 */
export const getRequiredSkills = async () => {
  const response = await api.get('required-skills');
  return response.data;
};

/**
 * Get skill learning progress
 * @returns {Promise<Object>} Skill progress data
 */
export const getSkillProgress = async () => {
  const response = await api.get('required-skills/progress');
  return response.data;
};

/**
 * Extract keywords from resume text or resume ID
 * @param {Object} params - Parameters object
 * @param {string} [params.text] - Resume text to extract keywords from
 * @param {string} [params.resumeId] - Resume ID to extract keywords from
 * @returns {Promise<Object>} Extracted keywords data
 */
export const extractKeywords = async ({ text, resumeId }) => {
  const response = await api.post('required-skills/extract-keywords', {
    text,
    resumeId
  });
  return response.data;
};

/**
 * Compare two resume versions
 * @param {string} firstId - First resume ID
 * @param {string} secondId - Second resume ID
 * @returns {Promise<Object>} Comparison data between the two resumes
 */
export const compareResumes = async (firstId, secondId) => {
  const response = await api.get('resumes/compare', {
    params: { firstId, secondId }
  });
  return response.data;
};
