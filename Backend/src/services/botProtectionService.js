import axios from 'axios';
import logger from '../config/logger.js';
import config from '../config/env.js';

class BotProtectionService {
  constructor() {
    this.recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Test key
    this.rateLimitStore = new Map(); // In production, use Redis
    this.suspiciousIPs = new Set();
  }

  /**
   * Verify reCAPTCHA token
   */
  async verifyRecaptcha(token, remoteip) {
    try {
      if (!token) {
        return {
          success: false,
          error: 'reCAPTCHA token is required',
          score: 0
        };
      }

      const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: this.recaptchaSecretKey,
          response: token,
          remoteip: remoteip
        }
      });

      const result = response.data;
      
      logger.info('reCAPTCHA verification result', {
        success: result.success,
        score: result.score,
        action: result.action,
        hostname: result.hostname,
        remoteip
      });

      return {
        success: result.success,
        score: result.score || 0,
        action: result.action,
        hostname: result.hostname,
        challenge_ts: result.challenge_ts,
        error_codes: result['error-codes']
      };
    } catch (error) {
      logger.error('reCAPTCHA verification error', {
        error: error.message,
        token: token?.substring(0, 10) + '...',
        remoteip
      });

      return {
        success: false,
        error: 'reCAPTCHA verification failed',
        score: 0
      };
    }
  }

  /**
   * Check and update rate limits
   */
  checkRateLimit(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const key = `rate_limit:${identifier}`;
    
    if (!this.rateLimitStore.has(key)) {
      this.rateLimitStore.set(key, {
        attempts: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    const record = this.rateLimitStore.get(key);
    
    // Reset if window expired
    if (now >= record.resetTime) {
      this.rateLimitStore.set(key, {
        attempts: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    // Check if limit exceeded
    if (record.attempts >= maxAttempts) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: record.resetTime 
      };
    }

    // Increment attempts
    record.attempts++;
    return { 
      allowed: true, 
      remaining: maxAttempts - record.attempts 
    };
  }

  /**
   * Analyze registration data for bot-like patterns
   */
  analyzeRegistrationData(data, metadata = {}) {
    let suspiciousScore = 0;
    const flags = [];

    // 1. Check form filling speed
    if (metadata.formDuration) {
      if (metadata.formDuration < 5000) { // Less than 5 seconds
        suspiciousScore += 30;
        flags.push('form_filled_too_quickly');
      } else if (metadata.formDuration < 10000) { // Less than 10 seconds
        suspiciousScore += 15;
        flags.push('form_filled_quickly');
      }
    }

    // 2. Check honeypot
    if (data.website && data.website.trim() !== '') {
      suspiciousScore += 50;
      flags.push('honeypot_filled');
    }

    // 3. Check behavioral data
    if (metadata.keystrokes < 20) {
      suspiciousScore += 20;
      flags.push('insufficient_keystrokes');
    }

    if (metadata.mouseMovements < 5) {
      suspiciousScore += 20;
      flags.push('insufficient_mouse_movement');
    }

    // 4. Check data patterns
    // Email patterns
    if (data.email) {
      // Check for generated email patterns
      const emailPattern = /^[a-z]+\d+@(tempmail|guerrillamail|10minutemail|mailinator)/i;
      if (emailPattern.test(data.email)) {
        suspiciousScore += 40;
        flags.push('temporary_email');
      }

      // Check for sequential or repeated characters
      if (/(.)\1{3,}/.test(data.email)) {
        suspiciousScore += 20;
        flags.push('repetitive_email_pattern');
      }
    }

    // Name patterns
    if (data.name) {
      // Check for generated name patterns
      if (/^[a-z]+\d+$/i.test(data.name.replace(/\s/g, ''))) {
        suspiciousScore += 25;
        flags.push('generated_name_pattern');
      }

      // Check for keyboard patterns
      if (/qwerty|asdf|zxcv|123456|abcdef/i.test(data.name.replace(/\s/g, ''))) {
        suspiciousScore += 30;
        flags.push('keyboard_pattern_name');
      }
    }

    // Phone patterns
    if (data.phone) {
      // Check for sequential numbers
      if (/(\d)\1{4,}/.test(data.phone)) {
        suspiciousScore += 20;
        flags.push('repetitive_phone_pattern');
      }
    }

    // 5. Check timing patterns
    if (metadata.keystrokeIntervals) {
      const avgInterval = metadata.keystrokeIntervals.reduce((a, b) => a + b, 0) / metadata.keystrokeIntervals.length;
      if (avgInterval < 50) { // Too consistent/fast
        suspiciousScore += 25;
        flags.push('robotic_typing_pattern');
      }
    }

    return {
      suspiciousScore,
      flags,
      riskLevel: this.getRiskLevel(suspiciousScore),
      recommendation: this.getRecommendation(suspiciousScore, flags)
    };
  }

  /**
   * Get risk level based on suspicious score
   */
  getRiskLevel(score) {
    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    if (score >= 20) return 'LOW';
    return 'MINIMAL';
  }

  /**
   * Get recommendation based on analysis
   */
  getRecommendation(score, flags) {
    if (score >= 70) {
      return 'BLOCK';
    } else if (score >= 40) {
      return 'MANUAL_REVIEW';
    } else if (score >= 20) {
      return 'ADDITIONAL_VERIFICATION';
    }
    return 'ALLOW';
  }

  /**
   * Comprehensive bot protection check
   */
  async performBotProtectionCheck(req, data) {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    const results = {
      isBot: false,
      confidence: 0,
      checks: {},
      metadata: {
        ip: clientIP,
        userAgent,
        timestamp: new Date().toISOString()
      }
    };

    try {
      // 1. Rate limiting check
      const rateLimitResult = this.checkRateLimit(clientIP, 3, 15 * 60 * 1000); // 3 attempts per 15 minutes
      results.checks.rateLimit = rateLimitResult;

      if (!rateLimitResult.allowed) {
        results.isBot = true;
        results.confidence = 90;
        results.reason = 'Rate limit exceeded';
        return results;
      }

      // 2. reCAPTCHA verification
      if (data.captchaToken) {
        const captchaResult = await this.verifyRecaptcha(data.captchaToken, clientIP);
        results.checks.captcha = captchaResult;

        if (!captchaResult.success) {
          results.isBot = true;
          results.confidence = 85;
          results.reason = 'reCAPTCHA verification failed';
          return results;
        }

        // For reCAPTCHA v3, check score
        // Be more lenient in development since test keys return score 0
        const scoreThreshold = process.env.NODE_ENV === 'production' ? 0.3 : 0.0;
        if (captchaResult.score !== undefined && captchaResult.score < scoreThreshold) {
          // In development with test keys, allow score 0
          if (process.env.NODE_ENV !== 'production' && captchaResult.hostname === 'testkey.google.com') {
            logger.info('Allowing test reCAPTCHA token in development', {
              score: captchaResult.score,
              hostname: captchaResult.hostname
            });
          } else {
            results.isBot = true;
            results.confidence = 80;
            results.reason = 'Low reCAPTCHA score';
            return results;
          }
        }
      } else {
        // In development, be more lenient with missing reCAPTCHA
        if (process.env.NODE_ENV !== 'production') {
          logger.warn('Missing reCAPTCHA token in development - allowing', { ip: clientIP });
          results.isBot = false;
          results.confidence = 0;
          results.reason = 'Development mode - CAPTCHA not required';
        } else {
          results.isBot = true;
          results.confidence = 95;
          results.reason = 'Missing reCAPTCHA token';
          return results;
        }
      }

      // 3. Data pattern analysis
      const behaviorData = data.botProtection || {};
      const analysisResult = this.analyzeRegistrationData(data, {
        formDuration: behaviorData.analytics?.formDuration,
        keystrokes: behaviorData.analytics?.keystrokes || 0,
        mouseMovements: behaviorData.analytics?.mouseMovements || 0,
        focusEvents: behaviorData.analytics?.focusEvents || 0
      });
      results.checks.dataAnalysis = analysisResult;

      // 4. User Agent analysis
      results.checks.userAgent = this.analyzeUserAgent(userAgent);

      // 5. Final determination
      let totalSuspicionScore = analysisResult.suspiciousScore;
      
      if (results.checks.userAgent.suspicious) {
        totalSuspicionScore += 20;
      }

      // Adjust thresholds based on environment
      const highThreshold = process.env.NODE_ENV === 'production' ? 80 : 90;
      const moderateThreshold = process.env.NODE_ENV === 'production' ? 50 : 70;
      
      if (totalSuspicionScore >= highThreshold) {
        results.isBot = true;
        results.confidence = Math.min(95, 50 + totalSuspicionScore);
        results.reason = 'High suspicious activity score';
      } else if (totalSuspicionScore >= moderateThreshold) {
        results.isBot = false;
        results.confidence = 30;
        results.reason = 'Moderate suspicious activity - allow with monitoring';
      }

      results.suspicionScore = totalSuspicionScore;
      
      // Log the result
      logger.info('Bot protection check completed', {
        ip: clientIP,
        isBot: results.isBot,
        confidence: results.confidence,
        suspicionScore: totalSuspicionScore,
        flags: analysisResult.flags
      });

      return results;

    } catch (error) {
      logger.error('Bot protection check error', {
        error: error.message,
        ip: clientIP,
        stack: error.stack
      });

      // In case of error, allow but log
      results.isBot = false;
      results.confidence = 0;
      results.reason = 'Protection check failed - allowing with caution';
      results.error = error.message;

      return results;
    }
  }

  /**
   * Analyze User Agent for bot patterns
   */
  analyzeUserAgent(userAgent) {
    const suspicious = [];
    let score = 0;

    // Common bot patterns
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /headless/i, /phantom/i, /selenium/i, /webdriver/i,
      /curl/i, /wget/i, /python/i, /java/i
    ];

    for (const pattern of botPatterns) {
      if (pattern.test(userAgent)) {
        suspicious.push('bot_pattern_detected');
        score += 40;
        break;
      }
    }

    // Check for missing common browser indicators
    if (!userAgent.includes('Mozilla')) {
      suspicious.push('missing_mozilla');
      score += 20;
    }

    // Suspiciously short or long user agents
    if (userAgent.length < 20 || userAgent.length > 500) {
      suspicious.push('unusual_length');
      score += 15;
    }

    return {
      suspicious: score > 20,
      score,
      flags: suspicious,
      userAgent: userAgent.substring(0, 200) // Log only first 200 chars
    };
  }

  /**
   * Clean up old rate limit entries
   */
  cleanupRateLimitStore() {
    const now = Date.now();
    for (const [key, record] of this.rateLimitStore.entries()) {
      if (now >= record.resetTime) {
        this.rateLimitStore.delete(key);
      }
    }
  }
}

// Create singleton instance
const botProtectionService = new BotProtectionService();

// Cleanup rate limit store every 5 minutes
setInterval(() => {
  botProtectionService.cleanupRateLimitStore();
}, 5 * 60 * 1000);

export default botProtectionService;
