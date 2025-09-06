import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, ChevronDown, Globe, User, Settings, 
  LogOut, Bell, Search, Brain, Building2, Home,
  BookOpen, Briefcase, FileText, Target, Shield,
  Bubbles
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLanguageChange = (language) => {
    setLanguageOpen(false);
    // Here you would implement language change logic
    console.log(`Language changed to: ${language}`);
  };

  const handleFeatureClick = (feature) => {
    setFeaturesOpen(false);
    // Navigate to specific sections or pages
    switch (feature) {
      case 'smart-matching':
        navigate('/student-dashboard/recommended-internships');
        break;
      case 'skill-growth':
        navigate('/student-dashboard/required-skills');
        break;
      case 'applications':
        navigate('/student-dashboard/applied-internships');
        break;
      default:
        navigate('/#features');
    }
  };

  const handleSettingsClick = (setting) => {
    setSettingsOpen(false);
    switch (setting) {
      case 'profile':
        navigate('/student-dashboard/profile');
        break;
      case 'notifications':
        navigate('/student-dashboard/notifications');
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
    switch (action) {
      case 'profile':
        navigate('/student-dashboard/profile');
        break;
      case 'dashboard':
        navigate('/student-dashboard');
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
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <Bubbles className="w-8 h-8" />
            <span className="text-2xl font-bold">Ignite-X</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Features Dropdown */}
            <div className="relative" ref={featuresRef}>
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="flex items-center gap-1 hover:text-gray-200 transition-colors px-3 py-2 rounded-lg hover:bg-blue-700"
              >
                Features <ChevronDown size={18} />
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
                      <div className="text-xs text-gray-500">Smart internship recommendations</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleFeatureClick('skill-growth')}
                    className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 mr-3 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Skill Development</div>
                      <div className="text-xs text-gray-500">Learn required skills</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleFeatureClick('applications')}
                    className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-3 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">Application Tracking</div>
                      <div className="text-xs text-gray-500">Track your applications</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleFeatureClick('equal-access')}
                    className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors rounded-b-lg"
                  >
                    <Target className="w-4 h-4 mr-3 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium">Equal Access</div>
                      <div className="text-xs text-gray-500">Inclusive opportunities</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center gap-1 hover:text-gray-200 transition-colors px-3 py-2 rounded-lg hover:bg-blue-700"
              >
                <Globe size={18} /> Language <ChevronDown size={14} />
              </button>
              {languageOpen && (
                <div className="absolute mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2">
                  <button 
                    onClick={() => handleLanguageChange('English')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    English
                  </button>
                  <button 
                    onClick={() => handleLanguageChange('Hindi')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    हिंदी
                  </button>
                  <button 
                    onClick={() => handleLanguageChange('Bengali')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    বাংলা
                  </button>
                  <button 
                    onClick={() => handleLanguageChange('Telugu')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    తెలుగు
                  </button>
                  <button 
                    onClick={() => handleLanguageChange('Marathi')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors rounded-b-lg"
                  >
                    मराठी
                  </button>
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
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                

                {/* Settings Dropdown */}
                <div className="relative" ref={settingsRef}>
                  <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="flex items-center gap-1 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-blue-700"
                  >
                    <Settings size={18} />
                  </button>
                  {settingsOpen && (
                    <div className="absolute mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2">
                      <button 
                        onClick={() => handleSettingsClick('profile')}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3 text-blue-600" />
                        Profile Settings
                      </button>
                      <button 
                        onClick={() => handleSettingsClick('notifications')}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <Bell className="w-4 h-4 mr-3 text-green-600" />
                        Notifications
                      </button>
                      <button 
                        onClick={() => handleSettingsClick('privacy')}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <Shield className="w-4 h-4 mr-3 text-purple-600" />
                        Privacy & Security
                      </button>
                      <button 
                        onClick={() => handleSettingsClick('theme')}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors rounded-b-lg"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-600" />
                        Dark/Light Mode
                      </button>
                    </div>
                  )}
                </div>

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
                        <p className="text-sm text-gray-500">Student</p>
                      </div>
                      <button 
                        onClick={() => handleProfileClick('profile')}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3 text-blue-600" />
                        My Profile
                      </button>
                      <button 
                        onClick={() => handleProfileClick('dashboard')}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <Home className="w-4 h-4 mr-3 text-green-600" />
                        Dashboard
                      </button>
                      <button 
                        onClick={() => handleProfileClick('logout')}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-100 transition-colors text-red-600 rounded-b-lg"
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
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
        <div className="md:hidden bg-blue-700 text-white px-4 pb-4 space-y-3">
          {/* Features dropdown in mobile */}
          <div>
            <button
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className="flex items-center gap-1 w-full py-2 text-left"
            >
              Features <ChevronDown size={18} />
            </button>
            {featuresOpen && (
              <div className="ml-4 space-y-1">
                <button 
                  onClick={() => handleFeatureClick('smart-matching')}
                  className="block py-1 text-blue-200 hover:text-white"
                >
                  AI Matching
                </button>
                <button 
                  onClick={() => handleFeatureClick('skill-growth')}
                  className="block py-1 text-blue-200 hover:text-white"
                >
                  Skill Development
                </button>
                <button 
                  onClick={() => handleFeatureClick('applications')}
                  className="block py-1 text-blue-200 hover:text-white"
                >
                  Application Tracking
                </button>
                <button 
                  onClick={() => handleFeatureClick('equal-access')}
                  className="block py-1 text-blue-200 hover:text-white"
                >
                  Equal Access
                </button>
              </div>
            )}
          </div>

          {/* Language dropdown in mobile */}
          <div>
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center gap-1 w-full py-2 text-left"
            >
              <Globe size={18} /> Language <ChevronDown size={14} />
            </button>
            {languageOpen && (
              <div className="ml-4 space-y-1 bg-white text-gray-800 rounded-lg mt-2 p-2">
                <button 
                  onClick={() => handleLanguageChange('English')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 rounded"
                >
                  English
                </button>
                <button 
                  onClick={() => handleLanguageChange('Hindi')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 rounded"
                >
                  हिंदी
                </button>
                <button 
                  onClick={() => handleLanguageChange('Bengali')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 rounded"
                >
                  বাংলা
                </button>
                <button 
                  onClick={() => handleLanguageChange('Telugu')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 rounded"
                >
                  తెలుగు
                </button>
                <button 
                  onClick={() => handleLanguageChange('Marathi')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 rounded"
                >
                  मराठी
                </button>
              </div>
            )}
          </div>

          {/* Authentication Section in Mobile */}
          {!isAuthenticated ? (
            <>
              <button
                onClick={handleLogin}
                className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-medium"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="w-full px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-700 font-medium"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2 py-2">
                <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="font-medium">{userName}</span>
              </div>
              <button className="flex items-center px-4 py-2 hover:bg-blue-600 rounded-lg w-full text-left">
                <Bell className="w-4 h-4 mr-3" />
                Notifications
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
              </button>
              <button 
                onClick={() => handleProfileClick('profile')}
                className="block px-4 py-2 hover:bg-blue-600 rounded-lg w-full text-left"
              >
                My Profile
              </button>
              <button 
                onClick={() => handleProfileClick('dashboard')}
                className="block px-4 py-2 hover:bg-blue-600 rounded-lg w-full text-left"
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleProfileClick('logout')}
                className="w-full px-4 py-2 text-left hover:bg-blue-600 rounded-lg text-red-300"
              >
                <LogOut size={16} className="inline mr-2" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;