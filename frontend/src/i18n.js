import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import bn from './locales/bn.json';
import mr from './locales/mr.json';

// Language resources
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  te: { translation: te },
  bn: { translation: bn },
  mr: { translation: mr }
};

// Language configuration
const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
];

// Detection options
const detectionOptions = {
  // Order and from where user language should be detected
  order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
  
  // Keys or params to lookup language from
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  
  // Cache user language on
  caches: ['localStorage', 'sessionStorage'],
  
  // Optional expire and domain for set cookie
  cookieMinutes: 10080, // 7 days
  cookieDomain: 'localhost',
  
  // Only detect on first time visiting the page
  checkWhitelist: true
};

i18n
  // Use language detector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection
    detection: detectionOptions,
    
    // Whitelist of allowed languages
    supportedLngs: languages.map(lang => lang.code),
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already does escaping
      formatSeparator: ',',
      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (value instanceof Date) {
          if (format === 'short') return value.toLocaleDateString(lng);
          return value.toLocaleString(lng);
        }
        return value;
      }
    },
    
    // React specific options
    react: {
      // Wait for all translations to be loaded before rendering
      wait: true,
      // Bind i18n instance to the component
      bindI18n: 'languageChanged',
      // Bind store to the component (will cause a rerender on store changes)
      bindI18nStore: '',
      // Set to true if you like to use a user language
      useSuspense: false
    },
    
    // Translation loading
    load: 'languageOnly', // Remove region code (e.g., 'en-US' -> 'en')
    cleanCode: true, // Language will be lowercased EN --> en
    
    // Namespace options
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Key separator
    keySeparator: '.',
    
    // Namespace separator  
    nsSeparator: ':',
    
    // Pluralization
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Missing key handling
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: function(lng, ns, key, fallbackValue) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    },
    
    // Post processing
    postProcess: ['interval', 'plural']
  });

export default i18n;
export { languages };

// Export utility functions
export const getCurrentLanguage = () => i18n.language;
export const changeLanguage = (lng) => i18n.changeLanguage(lng);
export const getLanguageInfo = (code) => languages.find(lang => lang.code === code);
export const isRTL = (lng) => ['ar', 'he', 'fa'].includes(lng || getCurrentLanguage());

// Custom hook for language management
export const useLanguage = () => {
  const currentLanguage = getCurrentLanguage();
  const languageInfo = getLanguageInfo(currentLanguage);
  
  return {
    currentLanguage,
    languageInfo,
    languages,
    changeLanguage,
    isRTL: isRTL(currentLanguage)
  };
};
