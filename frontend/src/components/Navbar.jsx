import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, ChevronDown, Globe, User, Settings, 
  LogOut, Bell, Search, Brain, Building2, Home,
  BookOpen, Briefcase, FileText, Target, Shield,
  Bubbles
} from "lucide-react";
import { useNavTranslation } from '../hooks/useTranslation.jsx';
import { useLanguageContext } from '../contexts/LanguageContext';
import { authToasts } from '../utils/toast.jsx';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, tCommon } = useNavTranslation();
  const { availableLanguages, switchLanguage, currentLanguage, isLoading: isLanguageLoading } = useLanguageContext();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState("Student User");

  // Refs for dropdown management
  const featuresRef = useRef(null);
  const languageRef = useRef(null);
  const profileRef = useRef(null);
  const settingsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    // Check authentication status
    const checkAuthStatus = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const userTypeData = localStorage.getItem('userType');
      const userNameData = localStorage.getItem('userName');
      
      setIsAuthenticated(authStatus === 'true');
      setUserType(userTypeData);
      setUserName(userNameData || "Student User");
    };

    // Check on mount
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'isAuthenticated' || e.key === 'userType' || e.key === 'userName') {
        checkAuthStatus();
      }
    };

    // Listen for custom auth state change events
    const handleAuthStateChange = (e) => {
      const { isAuthenticated, userType, userName } = e.detail;
      setIsAuthenticated(isAuthenticated);
      setUserType(userType);
      setUserName(userName || "Student User");
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthStateChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setFeaturesOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
      // Close mobile menu when clicking outside on mobile devices
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && window.innerWidth < 768) {
        setMobileMenuOpen(false);
        setFeaturesOpen(false);
        setLanguageOpen(false);
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to close all mobile dropdowns
  const closeMobileDropdowns = () => {
    setFeaturesOpen(false);
    setLanguageOpen(false);
    setSettingsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserType(null);
    setUserName("Student User");
    setProfileOpen(false);
    
    // Dispatch custom event to notify other components of logout
    window.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { isAuthenticated: false, userType: null, userName: "Student User" }
    }));
    
    // Show logout success toast
    authToasts.logoutSuccess();
    
    navigate('/');
  };

  const handleLogin = () => {
    setMobileMenuOpen(false); // Close mobile menu
    navigate('/login');
  };

  const handleRegister = () => {
    setMobileMenuOpen(false); // Close mobile menu
    navigate('/register');
  };

  const handleLanguageChange = async (languageCode) => {
    setLanguageOpen(false);
    try {
      await switchLanguage(languageCode);
      console.log(`Language changed to: ${languageCode}`);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const handleFeatureClick = (feature) => {
    setFeaturesOpen(false);
    setMobileMenuOpen(false); // Close mobile menu when navigating
    // Navigate to specific sections or pages
    switch (feature) {
      case 'smart-matching':
        if (userType === 'admin') {
          navigate('/admin/internship-data');
        } else {
          navigate('/student-dashboard/recommended-internships');
        }
        break;
      case 'skill-growth':
        if (userType === 'admin') {
          navigate('/admin/user-management');
        } else {
          navigate('/student-dashboard/required-skills');
        }
        break;
      case 'applications':
        if (userType === 'admin') {
          navigate('/admin/overview');
        } else {
          navigate('/student-dashboard/applied-internships');
        }
        break;
      case 'equal-access':
        if (userType === 'admin') {
          navigate('/admin/overview');
        } else {
          navigate('/student-dashboard/resume-upload');
        }
        break;
      default:
        if (isAuthenticated) {
          navigate(userType === 'admin' ? '/admin' : '/student-dashboard');
        } else {
          navigate('/#features');
        }
    }
  };

  const handleSettingsClick = (setting) => {
    setSettingsOpen(false);
    setMobileMenuOpen(false); // Close mobile menu when navigating
    switch (setting) {
      case 'profile':
        if (userType === 'admin') {
          navigate('/admin/profile');
        } else {
          navigate('/student-dashboard/profile');
        }
        break;
      case 'notifications':
        if (userType === 'admin') {
          navigate('/admin/settings');
        } else {
          navigate('/student-dashboard/notifications');
        }
        break;
      case 'privacy':
        navigate('/privacy');
        break;
      case 'theme':
        // Toggle theme logic here
        console.log('Theme toggle clicked');
        break;
    }
  };

  const handleProfileClick = (action) => {
    setProfileOpen(false);
    setMobileMenuOpen(false); // Close mobile menu when navigating
    switch (action) {
      case 'profile':
        if (userType === 'admin') {
          navigate('/admin/profile');
        } else {
          navigate('/student-dashboard/profile');
        }
        break;
      case 'dashboard':
        if (userType === 'admin') {
          navigate('/admin/overview');
        } else {
          navigate('/student-dashboard/recommended-internships');
        }
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity flex-shrink-0">
            <Bubbles className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold">Ignite-X</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Features Dropdown - Only show when not authenticated */}
            {!isAuthenticated && (
              <div className="relative" ref={featuresRef}>
                <button
                  onClick={() => setFeaturesOpen(!featuresOpen)}
                  className="flex items-center gap-1 hover:text-gray-200 transition-colors px-3 py-2 rounded-lg hover:bg-blue-700"
                >
                  {t('features')} <ChevronDown size={18} />
                </button>
                {featuresOpen && (
                  <div className="absolute mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2">
                    <button 
                      onClick={() => handleFeatureClick('smart-matching')}
                      className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                    >
                      <Brain className="w-4 h-4 mr-3 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">AI Matching</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleFeatureClick('skill-growth')}
                      className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 mr-3 text-green-600" />
                      <div className="text-left">
                        <div className="font-medium">Skills Development</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleFeatureClick('applications')}
                      className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-3 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium">Application Tracking</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleFeatureClick('equal-access')}
                      className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors rounded-b-lg"
                    >
                      <Target className="w-4 h-4 mr-3 text-orange-600" />
                      <div className="text-left">
                        <div className="font-medium">Resume Upload</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Language Dropdown */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center gap-1 hover:text-gray-200 transition-colors px-3 py-2 rounded-lg hover:bg-blue-700"
              >
                <Globe size={18} /> {t('language')} <ChevronDown size={14} />
              </button>
              {languageOpen && (
                <div className="absolute mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2">
                  {availableLanguages.map((language, index) => (
                    <button 
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      disabled={isLanguageLoading}
                      className={`block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                        currentLanguage === language.code ? 'bg-blue-50 text-blue-600 font-medium' : ''
                      } ${
                        index === availableLanguages.length - 1 ? 'rounded-b-lg' : ''
                      } ${
                        isLanguageLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{language.nativeName}</span>
                        {currentLanguage === language.code && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Authentication Section */}
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  {t('login')}
                </button>
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {t('register')}
                </button>
              </>
            ) : (
              <>
                

                {/* Notifications Button */}
                <button
                  onClick={() => {
                    if (userType === 'admin') {
                      navigate('/admin/settings');
                    } else {
                      navigate('/student-dashboard/notifications');
                    }
                  }}
                  className="relative p-2 text-white hover:text-gray-200 transition-colors rounded-lg hover:bg-blue-700"
                >
                  <Bell size={18} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-blue-700"
                  >
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <span className="font-medium hidden lg:block">{userName}</span>
                    <ChevronDown size={16} />
                  </button>
                  {profileOpen && (
                    <div className="absolute mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-medium text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-500 capitalize">{userType === 'admin' ? t('admin', 'Admin') : t('student', 'Student')}</p>
                    </div>
                      <button 
                        onClick={() => handleProfileClick('profile')}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3 text-blue-600" />
                        {t('profile')}
                      </button>
                      <button 
                        onClick={() => handleProfileClick('dashboard')}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <Home className="w-4 h-4 mr-3 text-green-600" />
                        {t('dashboard')}
                      </button>
                      <button 
                        onClick={() => handleProfileClick('logout')}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors text-red-600 rounded-b-lg"
                      >
                        <LogOut size={16} className="mr-3" />
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-blue-700 text-white px-4 pb-6 space-y-3 border-t border-blue-600 shadow-lg"
        >
          {/* Authentication Section in Mobile */}
          {!isAuthenticated ? (
            <>
              <button
                onClick={handleLogin}
                className="w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-medium"
              >
                {t('login')}
              </button>
              <button
                onClick={handleRegister}
                className="w-full px-4 py-3 bg-blue-800 rounded-lg hover:bg-blue-700 font-medium"
              >
                {t('register')}
              </button>
              
              {/* Language selector for non-authenticated users */}
              <div className="border-t border-blue-600 pt-3">
                <p className="text-blue-200 text-sm mb-2 flex items-center gap-2">
                  <Globe size={16} /> {t('language')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {availableLanguages.slice(0, 4).map((language) => (
                    <button 
                      key={language.code}
                      onClick={() => {
                        handleLanguageChange(language.code);
                        setMobileMenuOpen(false);
                      }}
                      disabled={isLanguageLoading}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentLanguage === language.code 
                          ? 'bg-white text-blue-600 font-medium' 
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      } ${
                        isLanguageLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {language.nativeName}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* User info */}
              <div className="flex items-center space-x-3 py-2 border-b border-blue-600">
                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <div className="font-medium text-white">{userName}</div>
                  <div className="text-blue-200 text-sm capitalize">{userType === 'admin' ? 'Administrator' : 'Student'}</div>
                </div>
              </div>
              
              {/* Essential actions only */}
              <button 
                onClick={() => handleProfileClick('dashboard')}
                className="flex items-center px-4 py-3 hover:bg-blue-600 rounded-lg w-full text-left"
              >
                <Home className="w-5 h-5 mr-3" />
                {t('dashboard')}
              </button>
              
              <button 
                onClick={() => {
                  if (userType === 'admin') {
                    navigate('/admin/settings');
                  } else {
                    navigate('/student-dashboard/notifications');
                  }
                  setMobileMenuOpen(false);
                }}
                className="flex items-center px-4 py-3 hover:bg-blue-600 rounded-lg w-full text-left"
              >
                <Bell className="w-5 h-5 mr-3" />
                {tCommon('notifications', 'Notifications')}
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
              </button>
              
              <button 
                onClick={() => handleProfileClick('profile')}
                className="flex items-center px-4 py-3 hover:bg-blue-600 rounded-lg w-full text-left"
              >
                <User className="w-5 h-5 mr-3" />
                {t('profile')}
              </button>
              
              {/* Language selector in compact form */}
              <div className="border-t border-blue-600 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  {availableLanguages.slice(0, 2).map((language) => (
                    <button 
                      key={language.code}
                      onClick={() => {
                        handleLanguageChange(language.code);
                        setMobileMenuOpen(false);
                      }}
                      disabled={isLanguageLoading}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentLanguage === language.code 
                          ? 'bg-white text-blue-600 font-medium' 
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      } ${
                        isLanguageLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {language.nativeName}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => handleProfileClick('logout')}
                className="w-full px-4 py-3 text-left hover:bg-red-600 rounded-lg text-red-300 hover:text-white flex items-center border-t border-blue-600 pt-3 mt-3"
              >
                <LogOut size={18} className="mr-3" />
                {t('logout')}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;