/**
 * Feature Flag Service
 * Manages feature flags for gradual rollout and A/B testing
 */

import logger from '../config/logger.js';

/**
 * Feature Flag Service
 * Handles feature flag management and evaluation
 */
export class FeatureFlagService {
  constructor() {
    this.flags = new Map();
    this.loadDefaultFlags();
  }

  /**
   * Load default feature flags from environment
   */
  loadDefaultFlags() {
    // Resume V2 feature flag
    this.flags.set('resume_v2', {
      enabled: process.env.FEATURE_RESUME_V2 === 'true',
      description: 'Enhanced resume upload with ATS scoring',
      rolloutPercentage: parseInt(process.env.FEATURE_RESUME_V2_ROLLOUT || '0'),
      targetUsers: process.env.FEATURE_RESUME_V2_USERS?.split(',') || [],
      targetRoles: process.env.FEATURE_RESUME_V2_ROLES?.split(',') || ['STUDENT']
    });

    // ATS ML Service feature flag
    this.flags.set('ats_ml_service', {
      enabled: process.env.FEATURE_ATS_ML_SERVICE === 'true',
      description: 'Use ML service for ATS scoring',
      rolloutPercentage: parseInt(process.env.FEATURE_ATS_ML_SERVICE_ROLLOUT || '0'),
      targetUsers: [],
      targetRoles: []
    });

    // YouTube Integration feature flag
    this.flags.set('youtube_integration', {
      enabled: process.env.FEATURE_YOUTUBE_INTEGRATION === 'true',
      description: 'YouTube links for skill learning',
      rolloutPercentage: parseInt(process.env.FEATURE_YOUTUBE_INTEGRATION_ROLLOUT || '100'),
      targetUsers: [],
      targetRoles: ['STUDENT']
    });

    logger.info('Feature flags loaded', {
      flagCount: this.flags.size,
      flags: Array.from(this.flags.keys())
    });
  }

  /**
   * Check if a feature flag is enabled
   * @param {string} flagName - Feature flag name
   * @param {Object} context - User context for evaluation
   * @returns {boolean} Is feature enabled
   */
  isEnabled(flagName, context = {}) {
    try {
      const flag = this.flags.get(flagName);
      if (!flag) {
        logger.warn('Unknown feature flag requested', { flagName });
        return false;
      }

      // Check if flag is globally enabled
      if (!flag.enabled) {
        return false;
      }

      // Check user-specific targeting
      if (context.userId && flag.targetUsers.includes(context.userId)) {
        return true;
      }

      // Check role-based targeting
      if (context.role && flag.targetRoles.includes(context.role)) {
        return true;
      }

      // Check rollout percentage
      if (flag.rolloutPercentage > 0) {
        const userHash = this.hashUserId(context.userId || 'anonymous');
        const userPercentage = userHash % 100;
        return userPercentage < flag.rolloutPercentage;
      }

      return flag.enabled;
    } catch (error) {
      logger.error('Error evaluating feature flag', {
        flagName,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get feature flag configuration
   * @param {string} flagName - Feature flag name
   * @returns {Object|null} Flag configuration
   */
  getFlag(flagName) {
    return this.flags.get(flagName) || null;
  }

  /**
   * Get all feature flags
   * @returns {Object} All feature flags
   */
  getAllFlags() {
    const result = {};
    this.flags.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Set feature flag (for testing or admin override)
   * @param {string} flagName - Feature flag name
   * @param {Object} config - Flag configuration
   */
  setFlag(flagName, config) {
    this.flags.set(flagName, {
      ...config,
      updatedAt: new Date().toISOString()
    });
    
    logger.info('Feature flag updated', { flagName, config });
  }

  /**
   * Enable feature flag
   * @param {string} flagName - Feature flag name
   */
  enableFlag(flagName) {
    const flag = this.flags.get(flagName);
    if (flag) {
      flag.enabled = true;
      flag.updatedAt = new Date().toISOString();
      logger.info('Feature flag enabled', { flagName });
    }
  }

  /**
   * Disable feature flag
   * @param {string} flagName - Feature flag name
   */
  disableFlag(flagName) {
    const flag = this.flags.get(flagName);
    if (flag) {
      flag.enabled = false;
      flag.updatedAt = new Date().toISOString();
      logger.info('Feature flag disabled', { flagName });
    }
  }

  /**
   * Hash user ID for consistent rollout percentage
   * @param {string} userId - User ID
   * @returns {number} Hash value (0-99)
   */
  hashUserId(userId) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  }

  /**
   * Get feature flag evaluation context from request
   * @param {Object} req - Express request object
   * @returns {Object} Evaluation context
   */
  getContextFromRequest(req) {
    return {
      userId: req.user?.id,
      role: req.user?.role,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
  }

  /**
   * Middleware to add feature flags to request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   */
  middleware(req, res, next) {
    req.featureFlags = {
      isEnabled: (flagName) => this.isEnabled(flagName, this.getContextFromRequest(req)),
      getFlag: (flagName) => this.getFlag(flagName),
      context: this.getContextFromRequest(req)
    };
    next();
  }

  /**
   * Get service health status
   * @returns {Object} Health status
   */
  getHealth() {
    return {
      status: 'healthy',
      flagCount: this.flags.size,
      enabledFlags: Array.from(this.flags.entries())
        .filter(([_, config]) => config.enabled)
        .map(([name, _]) => name),
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const featureFlagService = new FeatureFlagService();
export default featureFlagService;
