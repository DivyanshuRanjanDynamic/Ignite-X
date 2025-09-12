import axios from 'axios';
import logger from '../config/logger.js';
import config from '../config/env.js';

class MLRecommendationService {
  constructor() {
    // ML Model API endpoint - adjust port as needed
    this.mlApiUrl = process.env.ML_API_URL || 'http://localhost:8000';
    this.timeout = 10000; // 10 seconds timeout
  }

  /**
   * Get recommendations from ML model
   * @param {Object} candidateData - Student profile data
   * @param {number} topN - Number of recommendations to return
   * @returns {Promise<Array>} Array of recommendations
   */
  async getRecommendations(candidateData, topN = 10) {
    try {
      logger.info('Requesting ML recommendations with filters', {
        candidateData: {
          education: candidateData.education,
          skills: candidateData.skills?.length || 0,
          interests: candidateData.interests?.length || 0,
          location: candidateData.location,
          workPreference: candidateData.workPreference,
          minStipend: candidateData.minStipend,
          maxDuration: candidateData.maxDuration,
          domain: candidateData.domain,
          educationLevel: candidateData.educationLevel,
          maxAmount: candidateData.maxAmount
        },
        topN
      });

      // Prepare candidate data for ML model with filter parameters
      const mlRequest = {
        education: candidateData.education || '',
        skills: Array.isArray(candidateData.skills) 
          ? candidateData.skills.join(', ') 
          : candidateData.skills || '',
        interests: Array.isArray(candidateData.interests) 
          ? candidateData.interests.join(', ') 
          : candidateData.interests || '',
        preferred_location: candidateData.location || '',
        mode: candidateData.workPreference || '',
        min_stipend: candidateData.minStipend || null,
        max_duration_weeks: candidateData.maxDuration || null,
        // Additional filter parameters
        domain: candidateData.domain || null,
        education_level: candidateData.educationLevel || null,
        max_stipend: candidateData.maxAmount || null,
        top_n: topN
      };

      // Call ML model API
      const response = await axios.post(
        `${this.mlApiUrl}/recommend`,
        mlRequest,
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.error) {
        throw new Error(`ML Model Error: ${response.data.error}`);
      }

      const recommendations = response.data.recommendations || [];
      
      logger.info('ML recommendations received', {
        count: recommendations.length,
        topScore: recommendations[0]?.score || 0
      });

      return recommendations;

    } catch (error) {
      logger.error('ML recommendation service error', {
        error: error.message,
        candidateData: {
          education: candidateData.education,
          skillsCount: candidateData.skills?.length || 0
        }
      });

      // Return fallback recommendations if ML service fails
      return this.getFallbackRecommendations(candidateData, topN);
    }
  }

  /**
   * Fallback recommendations when ML service is unavailable
   * @param {Object} candidateData - Student profile data
   * @param {number} topN - Number of recommendations
   * @returns {Array} Fallback recommendations
   */
  getFallbackRecommendations(candidateData, topN = 10) {
    logger.warn('Using fallback recommendations - ML service unavailable');

    // Basic fallback based on skills matching
    const fallbackRecommendations = [
      {
        title: "Digital India Intern",
        organization: "Ministry of Electronics & IT",
        location: "Remote",
        mode: "Remote",
        duration_weeks: 12,
        stipend_per_month: 12000,
        description: "Work on digital transformation projects and e-governance initiatives.",
        requirements: "Digital Literacy, Communication, Project Management",
        score: 0.85
      },
      {
        title: "Rural Development Intern",
        organization: "Ministry of Rural Development", 
        location: "Delhi",
        mode: "Onsite",
        duration_weeks: 24,
        stipend_per_month: 10000,
        description: "Assist in rural development programs and community outreach initiatives.",
        requirements: "Community Work, Research, Communication",
        score: 0.82
      },
      {
        title: "Skill Development Intern",
        organization: "Ministry of Skill Development",
        location: "Mumbai", 
        mode: "Onsite",
        duration_weeks: 16,
        stipend_per_month: 8000,
        description: "Support skill development programs and vocational training initiatives.",
        requirements: "Teaching, Training, Education",
        score: 0.78
      }
    ];

    // Filter by skills if available
    if (candidateData.skills && candidateData.skills.length > 0) {
      const userSkills = candidateData.skills.map(s => s.toLowerCase());
      return fallbackRecommendations
        .filter(rec => {
          const reqSkills = rec.requirements.toLowerCase();
          return userSkills.some(skill => reqSkills.includes(skill));
        })
        .slice(0, topN);
    }

    return fallbackRecommendations.slice(0, topN);
  }

  /**
   * Check if ML service is available
   * @returns {Promise<boolean>} Service availability
   */
  async isServiceAvailable() {
    try {
      const response = await axios.get(`${this.mlApiUrl}/`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      logger.warn('ML service health check failed', { error: error.message });
      return false;
    }
  }

  /**
   * Get service status for monitoring
   * @returns {Promise<Object>} Service status
   */
  async getServiceStatus() {
    try {
      const isAvailable = await this.isServiceAvailable();
      return {
        available: isAvailable,
        url: this.mlApiUrl,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      return {
        available: false,
        url: this.mlApiUrl,
        error: error.message,
        lastChecked: new Date().toISOString()
      };
    }
  }
}

const mlRecommendationService = new MLRecommendationService();
export default mlRecommendationService;
