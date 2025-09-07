import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languages, changeLanguage, getCurrentLanguage, getLanguageInfo } from '../i18n.js';

const LanguageContext = createContext();

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [isLoading, setIsLoading] = useState(false);

  // Update language state when i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCurrentLanguage(lng);
      // Update document language attribute
      document.documentElement.lang = lng;
      
      // Update document direction for RTL languages
      const isRTL = ['ar', 'he', 'fa'].includes(lng);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    };

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);

    // Set initial language attributes
    handleLanguageChange(i18n.language);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const switchLanguage = async (languageCode) => {
    if (languageCode === currentLanguage) return;
    
    setIsLoading(true);
    try {
      await changeLanguage(languageCode);
      
      // Store user preference
      localStorage.setItem('i18nextLng', languageCode);
      sessionStorage.setItem('i18nextLng', languageCode);
      
      // Trigger custom event for other components to listen
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: languageCode, languageInfo: getLanguageInfo(languageCode) }
      }));
      
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableLanguages = () => languages;
  
  const getCurrentLanguageInfo = () => getLanguageInfo(currentLanguage);

  const isLanguageSupported = (languageCode) => 
    languages.some(lang => lang.code === languageCode);

  const value = {
    currentLanguage,
    currentLanguageInfo: getCurrentLanguageInfo(),
    availableLanguages: getAvailableLanguages(),
    switchLanguage,
    isLanguageSupported,
    isLoading,
    isRTL: ['ar', 'he', 'fa'].includes(currentLanguage)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
