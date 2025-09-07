import i18n from '../i18n';
import { languages } from '../i18n';

class TranslationManager {
  constructor() {
    this.missingKeys = new Set();
    this.fallbackCache = new Map();
  }

  // Get translation with enhanced error handling
  getTranslation(key, options = {}) {
    try {
      const translation = i18n.t(key, {
        ...options,
        fallback: options.fallback || key,
        lng: options.language || i18n.language
      });

      // Check if translation is missing (same as key)
      if (translation === key && !options.fallback) {
        this.reportMissingKey(key, i18n.language);
        return this.getFallback(key, options);
      }

      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return this.getFallback(key, options);
    }
  }

  // Get fallback translation
  getFallback(key, options = {}) {
    const cacheKey = `${key}_${i18n.language}`;
    
    if (this.fallbackCache.has(cacheKey)) {
      return this.fallbackCache.get(cacheKey);
    }

    let fallback = options.fallback;
    
    if (!fallback) {
      // Try to get from English as fallback
      try {
        const englishTranslation = i18n.t(key, { lng: 'en' });
        if (englishTranslation !== key) {
          fallback = englishTranslation;
        } else {
          // Create human-readable key from the key path
          fallback = this.humanizeKey(key);
        }
      } catch {
        fallback = this.humanizeKey(key);
      }
    }

    // Cache the fallback
    this.fallbackCache.set(cacheKey, fallback);
    return fallback;
  }

  // Convert key to human readable format
  humanizeKey(key) {
    return key
      .split('.')
      .pop() // Get the last part of the key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .replace(/_/g, ' '); // Replace underscores with spaces
  }

  // Report missing translation key
  reportMissingKey(key, language) {
    const missingKey = `${key}:${language}`;
    
    if (!this.missingKeys.has(missingKey)) {
      this.missingKeys.add(missingKey);
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🌐 Missing translation: "${key}" for language: "${language}"`);
      }

      // You could send this to an analytics service or translation management system
      this.sendMissingKeyReport(key, language);
    }
  }

  // Send missing key report (placeholder for analytics/monitoring)
  sendMissingKeyReport(key, language) {
    // In production, you might want to send this to a service like:
    // - Google Analytics
    // - Sentry
    // - Custom translation management API
    
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to analytics
      // analytics.track('Missing Translation', { key, language });
    }
  }

  // Get all missing keys for debugging
  getMissingKeys() {
    return Array.from(this.missingKeys);
  }

  // Clear missing keys cache
  clearMissingKeys() {
    this.missingKeys.clear();
  }

  // Check if all required keys exist for a language
  validateTranslations(requiredKeys, language = i18n.language) {
    const missing = [];
    
    requiredKeys.forEach(key => {
      try {
        const translation = i18n.t(key, { lng: language });
        if (translation === key) {
          missing.push(key);
        }
      } catch {
        missing.push(key);
      }
    });

    return {
      isValid: missing.length === 0,
      missingKeys: missing,
      language
    };
  }

  // Get translation completeness percentage
  getCompleteness(baseLanguage = 'en') {
    const results = {};
    
    languages.forEach(lang => {
      if (lang.code === baseLanguage) {
        results[lang.code] = 100;
        return;
      }

      try {
        const baseTranslations = i18n.getResourceBundle(baseLanguage, 'translation');
        const targetTranslations = i18n.getResourceBundle(lang.code, 'translation');
        
        const baseKeys = this.flattenKeys(baseTranslations);
        const targetKeys = this.flattenKeys(targetTranslations);
        
        const totalKeys = baseKeys.length;
        const existingKeys = baseKeys.filter(key => 
          targetKeys.includes(key) && 
          this.getNestedValue(targetTranslations, key) !== this.getNestedValue(baseTranslations, key)
        ).length;
        
        results[lang.code] = Math.round((existingKeys / totalKeys) * 100);
      } catch (error) {
        console.error(`Error calculating completeness for ${lang.code}:`, error);
        results[lang.code] = 0;
      }
    });

    return results;
  }

  // Flatten nested object keys
  flattenKeys(obj, prefix = '') {
    const keys = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          keys.push(...this.flattenKeys(obj[key], newKey));
        } else {
          keys.push(newKey);
        }
      }
    }
    
    return keys;
  }

  // Get nested value from object using dot notation
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Auto-translate missing keys (placeholder for AI translation)
  async autoTranslate(missingKeys, targetLanguage, sourceLanguage = 'en') {
    // This is a placeholder for integration with translation APIs like:
    // - Google Translate API
    // - AWS Translate
    // - Azure Translator
    
    console.log(`Auto-translating ${missingKeys.length} keys from ${sourceLanguage} to ${targetLanguage}`);
    
    // Return mock translations for development
    return missingKeys.reduce((acc, key) => {
      acc[key] = `[AUTO-TRANSLATED] ${this.getTranslation(key, { lng: sourceLanguage })}`;
      return acc;
    }, {});
  }

  // Export missing translations for external tools
  exportMissingTranslations(format = 'json') {
    const missingByLanguage = {};
    
    this.missingKeys.forEach(item => {
      const [key, language] = item.split(':');
      if (!missingByLanguage[language]) {
        missingByLanguage[language] = [];
      }
      missingByLanguage[language].push(key);
    });

    if (format === 'json') {
      return JSON.stringify(missingByLanguage, null, 2);
    }
    
    if (format === 'csv') {
      let csv = 'Language,Key,Fallback\n';
      Object.entries(missingByLanguage).forEach(([lang, keys]) => {
        keys.forEach(key => {
          csv += `${lang},${key},${this.humanizeKey(key)}\n`;
        });
      });
      return csv;
    }

    return missingByLanguage;
  }
}

// Create singleton instance
const translationManager = new TranslationManager();

export default translationManager;

// Utility functions for components
export const t = (key, options) => translationManager.getTranslation(key, options);
export const validateTranslations = translationManager.validateTranslations.bind(translationManager);
export const getTranslationCompleteness = translationManager.getCompleteness.bind(translationManager);

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Add to window for debugging
  window.translationManager = translationManager;
  window.translationDebug = {
    getMissingKeys: () => translationManager.getMissingKeys(),
    getCompleteness: () => translationManager.getCompleteness(),
    exportMissing: (format) => translationManager.exportMissingTranslations(format)
  };
}
