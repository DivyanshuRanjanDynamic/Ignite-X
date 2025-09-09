import bcrypt from 'bcryptjs';
import config from '../config/env.js';
import logger from '../config/logger.js';

class PasswordUtil {
  /**
   * Hash a plain text password
   * @param {string} plainPassword - The plain text password to hash
   * @returns {Promise<string>} The hashed password
   */
  async hash(plainPassword) {
    try {
      if (!plainPassword || typeof plainPassword !== 'string') {
        throw new Error('Password must be a non-empty string');
      }

      if (plainPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const saltRounds = config.security.bcryptSaltRounds;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

      logger.debug('Password hashed successfully', {
        saltRounds,
        passwordLength: plainPassword.length,
      });

      return hashedPassword;
    } catch (error) {
      logger.error('Error hashing password', {
        error: error.message,
        passwordLength: plainPassword?.length,
      });
      throw new Error('Password hashing failed');
    }
  }

  /**
   * Compare a plain text password with a hashed password
   * @param {string} plainPassword - The plain text password to compare
   * @param {string} hashedPassword - The hashed password to compare against
   * @returns {Promise<boolean>} True if passwords match, false otherwise
   */
  async compare(plainPassword, hashedPassword) {
    try {
      if (!plainPassword || !hashedPassword) {
        return false;
      }

      if (typeof plainPassword !== 'string' || typeof hashedPassword !== 'string') {
        return false;
      }

      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

      logger.debug('Password comparison completed', {
        isMatch,
        plainPasswordLength: plainPassword.length,
        hashedPasswordLength: hashedPassword.length,
      });

      return isMatch;
    } catch (error) {
      logger.error('Error comparing passwords', {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Validate password strength
   * @param {string} password - The password to validate
   * @returns {Object} Validation result with isValid and reasons
   */
  validateStrength(password) {
    const result = {
      isValid: false,
      score: 0,
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        noCommonPatterns: false,
      },
      suggestions: [],
    };

    if (!password || typeof password !== 'string') {
      result.suggestions.push('Password is required');
      return result;
    }

    // Check minimum length (8 characters)
    if (password.length >= 8) {
      result.requirements.minLength = true;
      result.score += 1;
    } else {
      result.suggestions.push('Password must be at least 8 characters long');
    }

    // Check for uppercase letter
    if (/[A-Z]/.test(password)) {
      result.requirements.hasUppercase = true;
      result.score += 1;
    } else {
      result.suggestions.push('Include at least one uppercase letter');
    }

    // Check for lowercase letter
    if (/[a-z]/.test(password)) {
      result.requirements.hasLowercase = true;
      result.score += 1;
    } else {
      result.suggestions.push('Include at least one lowercase letter');
    }

    // Check for number
    if (/\d/.test(password)) {
      result.requirements.hasNumber = true;
      result.score += 1;
    } else {
      result.suggestions.push('Include at least one number');
    }

    // Check for special character
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      result.requirements.hasSpecialChar = true;
      result.score += 1;
    } else {
      result.suggestions.push('Include at least one special character (!@#$%^&*)');
    }

    // Check for common patterns (basic check)
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /letmein/i,
      /welcome/i,
      /monkey/i,
      /dragon/i,
    ];

    const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
    if (!hasCommonPattern) {
      result.requirements.noCommonPatterns = true;
      result.score += 1;
    } else {
      result.suggestions.push('Avoid common passwords and patterns');
    }

    // Check for sequential characters
    if (!this.hasSequentialChars(password)) {
      result.score += 0.5;
    } else {
      result.suggestions.push('Avoid sequential characters (abc, 123)');
    }

    // Check for repeated characters
    if (!this.hasRepeatedChars(password)) {
      result.score += 0.5;
    } else {
      result.suggestions.push('Avoid repeated characters (aaa, 111)');
    }

    // Password is considered strong if it meets at least 4 main requirements
    result.isValid = result.score >= 4;

    logger.debug('Password strength validated', {
      score: result.score,
      isValid: result.isValid,
      requirementsMet: Object.values(result.requirements).filter(Boolean).length,
    });

    return result;
  }

  /**
   * Check for sequential characters in password
   * @private
   * @param {string} password - The password to check
   * @returns {boolean} True if sequential characters found
   */
  hasSequentialChars(password) {
    const sequences = [
      'abcdefghijklmnopqrstuvwxyz',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '0123456789',
    ];

    for (const sequence of sequences) {
      for (let i = 0; i <= sequence.length - 3; i++) {
        const substr = sequence.substring(i, i + 3);
        if (password.includes(substr)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check for repeated characters in password
   * @private
   * @param {string} password - The password to check
   * @returns {boolean} True if repeated characters found (3 or more in a row)
   */
  hasRepeatedChars(password) {
    for (let i = 0; i <= password.length - 3; i++) {
      if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
        return true;
      }
    }
    return false;
  }

 /**
 * Generate a strong temporary password that passes validateStrength
 * @param {number} length - Desired password length (default: 12)
 * @returns {string} Strong password
 */
generateTemporaryPassword(length = 12) {
  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loop

  do {
    password = '';
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill remaining characters randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    attempts++;
    if (attempts > maxAttempts) {
      throw new Error('Failed to generate a strong password after multiple attempts');
    }
  } while (!this.validateStrength(password).isValid);

  logger.debug('Temporary strong password generated', {
    length: password.length,
    attempts,
  });

  return password;
}


  /**
   * Check if password needs to be rehashed (e.g., salt rounds changed)
   * @param {string} hashedPassword - The current hashed password
   * @returns {boolean} True if password should be rehashed
   */
  needsRehash(hashedPassword) {
    try {
      if (!hashedPassword || typeof hashedPassword !== 'string') {
        return true;
      }

      // Check if the hash was created with current salt rounds
      const currentRounds = config.security.bcryptSaltRounds;
      const hashRounds = bcrypt.getRounds(hashedPassword);

      const needsRehash = hashRounds !== currentRounds;

      if (needsRehash) {
        logger.debug('Password needs rehashing', {
          currentRounds,
          hashRounds,
        });
      }

      return needsRehash;
    } catch (error) {
      logger.warn('Error checking if password needs rehash', {
        error: error.message,
      });
      // If we can't determine, assume it needs rehashing for security
      return true;
    }
  }
}

// Export singleton instance
const passwordUtil = new PasswordUtil();
export default passwordUtil;
