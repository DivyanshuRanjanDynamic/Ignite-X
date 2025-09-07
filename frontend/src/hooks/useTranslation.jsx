import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { useLanguageContext } from '../contexts/LanguageContext';

// Enhanced translation hook with additional utilities
export const useTranslation = (namespace = 'translation') => {
  const { t, i18n } = useI18nextTranslation(namespace);
  const languageContext = useLanguageContext();

  // Enhanced translation function with fallback support
  const translate = (key, options = {}) => {
    try {
      const translation = t(key, { 
        ...options,
        fallback: options.fallback || key 
      });
      
      // If translation is the same as key, it might be missing
      if (translation === key && process.env.NODE_ENV === 'development') {
        console.warn(`Translation missing for key: ${key} in language: ${i18n.language}`);
      }
      
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return options.fallback || key;
    }
  };

  // Pluralization helper
  const translatePlural = (key, count, options = {}) => {
    return translate(key, { 
      ...options, 
      count,
      defaultValue: count === 1 ? options.singular : options.plural 
    });
  };

  // Format translation with interpolation
  const formatTranslation = (key, values = {}, options = {}) => {
    return translate(key, { 
      ...options, 
      ...values,
      interpolation: { escapeValue: false }
    });
  };

  // Get nested translation object
  const getTranslationObject = (keyPrefix) => {
    try {
      return i18n.getResourceBundle(i18n.language, namespace)?.[keyPrefix] || {};
    } catch (error) {
      console.error('Error getting translation object:', error);
      return {};
    }
  };

  // Check if translation exists
  const hasTranslation = (key) => {
    return i18n.exists(key, { ns: namespace });
  };

  // Get all translations for current language
  const getAllTranslations = () => {
    try {
      return i18n.getResourceBundle(i18n.language, namespace) || {};
    } catch (error) {
      console.error('Error getting all translations:', error);
      return {};
    }
  };

  return {
    t: translate,
    i18n,
    translate,
    translatePlural,
    formatTranslation,
    getTranslationObject,
    hasTranslation,
    getAllTranslations,
    currentLanguage: languageContext.currentLanguage,
    switchLanguage: languageContext.switchLanguage,
    isLoading: languageContext.isLoading,
    ready: i18n.isInitialized
  };
};

// Specialized hooks for different sections
export const useAuthTranslation = () => {
  const { t, ...rest } = useTranslation();
  
  return {
    ...rest,
    t: (key, options) => t(`auth.${key}`, options),
    tCommon: (key, options) => t(`common.${key}`, options)
  };
};

export const useStudentTranslation = () => {
  const { t, ...rest } = useTranslation();
  
  return {
    ...rest,
    t: (key, options) => t(`student.${key}`, options),
    tCommon: (key, options) => t(`common.${key}`, options),
    tNav: (key, options) => t(`navigation.${key}`, options)
  };
};

export const useAdminTranslation = () => {
  const { t, ...rest } = useTranslation();
  
  return {
    ...rest,
    t: (key, options) => t(`admin.${key}`, options),
    tCommon: (key, options) => t(`common.${key}`, options),
    tNav: (key, options) => t(`navigation.${key}`, options)
  };
};

export const useNavTranslation = () => {
  const { t, ...rest } = useTranslation();
  
  return {
    ...rest,
    t: (key, options) => t(`navigation.${key}`, options),
    tCommon: (key, options) => t(`common.${key}`, options)
  };
};

export const useLandingTranslation = () => {
  const { t, ...rest } = useTranslation();
  
  return {
    ...rest,
    t: (key, options) => t(`landing.${key}`, options),
    tCommon: (key, options) => t(`common.${key}`, options),
    tNav: (key, options) => t(`navigation.${key}`, options)
  };
};

// Hook for form validation messages
export const useValidationTranslation = () => {
  const { t, ...rest } = useTranslation();
  
  const getValidationMessage = (field, type, options = {}) => {
    const key = `validation.${field}.${type}`;
    return t(key, { 
      ...options, 
      fallback: t(`validation.generic.${type}`, { 
        field: t(`fields.${field}`, { fallback: field }),
        ...options 
      })
    });
  };

  return {
    ...rest,
    getValidationMessage,
    t: (key, options) => t(`validation.${key}`, options)
  };
};

// Higher-order component for providing translations
export const withTranslation = (Component, namespace) => {
  return function TranslatedComponent(props) {
    const translation = useTranslation(namespace);
    return <Component {...props} {...translation} />;
  };
};

// Translation component for inline translations
export const T = ({ 
  i18nKey, 
  values = {}, 
  components = {}, 
  fallback = null,
  namespace = 'translation' 
}) => {
  const { t } = useTranslation(namespace);
  
  try {
    return t(i18nKey, { 
      ...values, 
      ...components,
      returnObjects: false,
      fallback: fallback || i18nKey
    });
  } catch (error) {
    console.error('Translation component error:', error);
    return fallback || i18nKey;
  }
};
