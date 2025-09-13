/**
 * ATS (Applicant Tracking System) Adapter Interface
 * Provides a pluggable interface for resume scoring and skill analysis
 */

import logger from '../config/logger.js';

/**
 * ATS Adapter Interface
 * All ATS implementations must implement these methods
 */
export class IATSAdapter {
  /**
   * Score a resume text and return overall score and skill breakdown
   * @param {string} text - Extracted resume text
   * @param {Object} userProfile - User profile data for context
   * @returns {Promise<Object>} ATS scoring results
   */
  async score(text, userProfile = {}) {
    throw new Error('score() method must be implemented by ATS adapter');
  }

  /**
   * Extract skills from resume text
   * @param {string} text - Resume text
   * @returns {Promise<Array>} Array of detected skills
   */
  async extractSkills(text) {
    throw new Error('extractSkills() method must be implemented by ATS adapter');
  }

  /**
   * Get health status of the ATS service
   * @returns {Promise<Object>} Health status
   */
  async getHealth() {
    throw new Error('getHealth() method must be implemented by ATS adapter');
  }
}

/**
 * Rule-based ATS Adapter (Fallback implementation)
 * Uses keyword matching and scoring rules when ML service is unavailable
 */
export class RuleBasedATSAdapter extends IATSAdapter {
  constructor() {
    super();
    this.skillKeywords = {
      'JavaScript': ['javascript', 'js', 'node.js', 'react', 'vue', 'angular'],
      'Python': ['python', 'django', 'flask', 'fastapi', 'pandas', 'numpy'],
      'Java': ['java', 'spring', 'hibernate', 'maven', 'gradle'],
      'C++': ['c++', 'cpp', 'c plus plus', 'stl', 'boost'],
      'SQL': ['sql', 'mysql', 'postgresql', 'mongodb', 'database'],
      'Git': ['git', 'github', 'gitlab', 'version control'],
      'Docker': ['docker', 'containerization', 'kubernetes'],
      'AWS': ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
      'Machine Learning': ['machine learning', 'ml', 'ai', 'tensorflow', 'pytorch'],
      'Data Analysis': ['data analysis', 'analytics', 'statistics', 'excel', 'tableau']
    };
    
    this.requiredSections = [
      'contact information',
      'summary',
      'experience',
      'education',
      'skills'
    ];
  }

  /**
   * Score resume using rule-based analysis
   * @param {string} text - Resume text
   * @param {Object} userProfile - User profile data
   * @returns {Promise<Object>} Scoring results
   */
  async score(text, userProfile = {}) {
    try {
      const lowerText = text.toLowerCase();
      
      // Calculate section completeness score
      const sectionScore = this.calculateSectionScore(lowerText);
      
      // Calculate skill scores
      const skillScores = await this.calculateSkillScores(lowerText, userProfile);
      
      // Calculate overall ATS score
      const overallScore = this.calculateOverallScore(sectionScore, skillScores);
      
      return {
        overallScore: Math.round(overallScore),
        skillScores: skillScores,
        sectionScore: sectionScore,
        recommendations: this.generateRecommendations(sectionScore, skillScores),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error in rule-based ATS scoring', { error: error.message });
      throw error;
    }
  }

  /**
   * Calculate section completeness score
   * @param {string} text - Lowercase resume text
   * @returns {number} Section score (0-100)
   */
  calculateSectionScore(text) {
    let foundSections = 0;
    
    this.requiredSections.forEach(section => {
      if (text.includes(section) || text.includes(section.replace(' ', ''))) {
        foundSections++;
      }
    });
    
    return (foundSections / this.requiredSections.length) * 100;
  }

  /**
   * Calculate skill scores based on keyword matching
   * @param {string} text - Lowercase resume text
   * @param {Object} userProfile - User profile data
   * @returns {Object} Skill scores map
   */
  async calculateSkillScores(text, userProfile) {
    const skillScores = {};
    
    Object.entries(this.skillKeywords).forEach(([skill, keywords]) => {
      let score = 0;
      let matches = 0;
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches_found = (text.match(regex) || []).length;
        matches += matches_found;
      });
      
      // Score based on keyword matches and context
      if (matches > 0) {
        score = Math.min(100, 60 + (matches * 10)); // Base 60 + 10 per match, max 100
      }
      
      // Boost score if skill is in user's preferred domain
      if (userProfile.skills && userProfile.skills.includes(skill)) {
        score = Math.min(100, score + 20);
      }
      
      skillScores[skill] = Math.round(score);
    });
    
    return skillScores;
  }

  /**
   * Calculate overall ATS score
   * @param {number} sectionScore - Section completeness score
   * @param {Object} skillScores - Individual skill scores
   * @returns {number} Overall score (0-100)
   */
  calculateOverallScore(sectionScore, skillScores) {
    const skillValues = Object.values(skillScores);
    const avgSkillScore = skillValues.length > 0 
      ? skillValues.reduce((sum, score) => sum + score, 0) / skillValues.length 
      : 0;
    
    // Weighted average: 40% sections, 60% skills
    return (sectionScore * 0.4) + (avgSkillScore * 0.6);
  }

  /**
   * Generate improvement recommendations
   * @param {number} sectionScore - Section score
   * @param {Object} skillScores - Skill scores
   * @returns {Array} Array of recommendations
   */
  generateRecommendations(sectionScore, skillScores) {
    const recommendations = [];
    
    if (sectionScore < 80) {
      recommendations.push('Add missing sections to improve ATS compatibility');
    }
    
    const weakSkills = Object.entries(skillScores)
      .filter(([skill, score]) => score < 70)
      .map(([skill]) => skill);
    
    if (weakSkills.length > 0) {
      recommendations.push(`Consider adding more details about: ${weakSkills.join(', ')}`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Resume looks good! Consider adding quantifiable achievements.');
    }
    
    return recommendations;
  }

  /**
   * Extract skills from resume text
   * @param {string} text - Resume text
   * @returns {Promise<Array>} Detected skills
   */
  async extractSkills(text) {
    const lowerText = text.toLowerCase();
    const detectedSkills = [];
    
    Object.entries(this.skillKeywords).forEach(([skill, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          if (!detectedSkills.includes(skill)) {
            detectedSkills.push(skill);
          }
        }
      });
    });
    
    return detectedSkills;
  }

  /**
   * Get health status
   * @returns {Promise<Object>} Health status
   */
  async getHealth() {
    return {
      status: 'healthy',
      adapter: 'rule-based',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * ML Service ATS Adapter
 * Integrates with existing ML service for advanced resume analysis
 */
export class MLServiceATSAdapter extends IATSAdapter {
  constructor(mlServiceUrl, apiKey) {
    super();
    this.mlServiceUrl = mlServiceUrl;
    this.apiKey = apiKey;
  }

  /**
   * Score resume using ML service
   * @param {string} text - Resume text
   * @param {Object} userProfile - User profile data
   * @returns {Promise<Object>} ML scoring results
   */
  async score(text, userProfile = {}) {
    try {
      const response = await fetch(`${this.mlServiceUrl}/analyze-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          text: text,
          userProfile: userProfile
        })
      });

      if (!response.ok) {
        throw new Error(`ML service error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        overallScore: result.overall_score || 0,
        skillScores: result.skill_scores || {},
        recommendations: result.recommendations || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('ML service ATS scoring failed', { error: error.message });
      // Fallback to rule-based scoring
      const fallbackAdapter = new RuleBasedATSAdapter();
      return await fallbackAdapter.score(text, userProfile);
    }
  }

  /**
   * Extract skills using ML service
   * @param {string} text - Resume text
   * @returns {Promise<Array>} Detected skills
   */
  async extractSkills(text) {
    try {
      const response = await fetch(`${this.mlServiceUrl}/extract-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`ML service error: ${response.status}`);
      }

      const result = await response.json();
      return result.skills || [];
    } catch (error) {
      logger.error('ML service skill extraction failed', { error: error.message });
      // Fallback to rule-based extraction
      const fallbackAdapter = new RuleBasedATSAdapter();
      return await fallbackAdapter.extractSkills(text);
    }
  }

  /**
   * Get health status of ML service
   * @returns {Promise<Object>} Health status
   */
  async getHealth() {
    try {
      const response = await fetch(`${this.mlServiceUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        adapter: 'ml-service',
        mlServiceStatus: response.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        adapter: 'ml-service',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

/**
 * ATS Adapter Factory
 * Creates appropriate ATS adapter based on configuration
 */
export class ATSAdapterFactory {
  static create(config) {
    const { type, mlServiceUrl, apiKey } = config;
    
    switch (type) {
      case 'ml-service':
        if (!mlServiceUrl || !apiKey) {
          logger.warn('ML service configuration incomplete, falling back to rule-based');
          return new RuleBasedATSAdapter();
        }
        return new MLServiceATSAdapter(mlServiceUrl, apiKey);
      
      case 'rule-based':
      default:
        return new RuleBasedATSAdapter();
    }
  }
}

export default ATSAdapterFactory;
