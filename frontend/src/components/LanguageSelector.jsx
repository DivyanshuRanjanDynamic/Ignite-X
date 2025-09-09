import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSelector = ({ 
  variant = 'default', // 'default', 'compact', 'icon-only'
  className = '',
  dropdownPosition = 'bottom-left' // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
}) => {
  const { availableLanguages, switchLanguage, currentLanguage, isLoading } = useLanguageContext();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = async (languageCode) => {
    setIsOpen(false);
    try {
      await switchLanguage(languageCode);
      console.log(`Language changed to: ${languageCode}`);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const getDropdownPositionClasses = () => {
    switch (dropdownPosition) {
      case 'bottom-right':
        return 'mt-2 right-0';
      case 'top-left':
        return 'mb-2 bottom-full left-0';
      case 'top-right':
        return 'mb-2 bottom-full right-0';
      default: // 'bottom-left'
        return 'mt-2 left-0';
    }
  };

  const getCurrentLanguage = () => {
    return availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];
  };

  const renderButton = () => {
    const currentLang = getCurrentLanguage();
    
    switch (variant) {
      case 'compact':
        return (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${className}`}
            disabled={isLoading}
          >
            <Globe size={16} />
            <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
            <ChevronDown size={12} />
          </button>
        );
      
      case 'icon-only':
        return (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-full transition-colors ${className}`}
            disabled={isLoading}
            title={t('navigation.language')}
          >
            <Globe size={18} />
          </button>
        );
      
      default:
        return (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${className}`}
            disabled={isLoading}
          >
            <Globe size={18} />
            <span className="font-medium">{t('navigation.language')}</span>
            <ChevronDown size={14} />
          </button>
        );
    }
  };

  return (
    <div className="relative" ref={selectorRef}>
      {renderButton()}
      
      {isOpen && (
        <div className={`absolute ${getDropdownPositionClasses()} w-40 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2 z-50`}>
          {availableLanguages.map((language, index) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              disabled={isLoading}
              className={`block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                currentLanguage === language.code ? 'bg-blue-50 text-blue-600 font-medium' : ''
              } ${
                index === availableLanguages.length - 1 ? 'rounded-b-lg' : ''
              } ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm">{language.nativeName}</span>
                  <span className="text-xs text-gray-500">{language.name}</span>
                </div>
                {currentLanguage === language.code && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
