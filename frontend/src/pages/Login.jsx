import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Brain, ArrowRight, User, Shield, CheckCircle, Users, Building2, TrendingUp, Home } from "lucide-react";
import { useAuthTranslation } from '../hooks/useTranslation.jsx';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("student");
  const navigate = useNavigate();
  const { t, tCommon } = useAuthTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Login:", { email, password, rememberMe, userType });
      
      // Set authentication state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', email.split('@')[0]); // Use email prefix as username
      
      // Dispatch custom event to notify navbar of auth change
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { isAuthenticated: true, userType: userType, userName: email.split('@')[0] }
      }));
      
      setIsLoading(false);
      
      // Redirect based on user type
      if (userType === 'admin') {
        navigate("/admin");
      } else {
        navigate("/student-dashboard");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 border border-gray-200"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Main Section */}
      <div className="flex flex-1 items-center justify-center px-4 py-6 sm:py-8 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden border border-blue-100"
        >
          
          {/* Mobile Header - Only visible on mobile */}
          <div className="lg:hidden bg-gradient-to-r from-blue-600 to-orange-500 p-6 text-center text-white">
            <div className="w-16 h-16 bg-black bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">PM Internship AI</h3>
            <p className="text-blue-100 text-sm">
              AI-powered internship recommendations
            </p>
          </div>
          
          {/* Desktop Left side - Enhanced Illustration */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-orange-500 items-center justify-center p-12 relative overflow-hidden">
            {/* subtle abstract shape for background */}
            <svg 
              className="absolute top-0 right-0 w-64 h-64 opacity-20 text-white" 
              fill="currentColor" 
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <circle cx="50" cy="50" r="50" />
            </svg>

            {/* overlay dim */}
            <div className="absolute inset-0 bg-black opacity-20"></div>

            <div className="relative z-10 max-w-md text-center text-white">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="w-28 h-28 bg-white bg-opacity-25 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Brain className="w-14 h-14 text-blue-100 animate-pulse" />
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="text-3xl font-extrabold mb-4 tracking-tight leading-tight"
              >
                Welcome to PM Internship AI
              </motion.h3>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-blue-100 text-lg leading-relaxed mb-6"
              >
                Your personalized AI-powered internship recommendation engine. 
                Find the perfect opportunities tailored to your skills and location.
              </motion.p>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.75, duration: 0.5 }}
                className="text-blue-200 text-sm font-semibold uppercase tracking-widest"
              >
                Empowering your career journey, one match at a time.
              </motion.p>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center mb-4 sm:mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 transition-colors ${
                  userType === 'admin' ? 'bg-indigo-100' : 'bg-blue-100'
                }`}>
                  {userType === 'admin' ? (
                    <Shield className={`w-5 h-5 sm:w-6 sm:h-6 ${userType === 'admin' ? 'text-indigo-600' : 'text-blue-600'}`} />
                  ) : (
                    <Brain className={`w-5 h-5 sm:w-6 sm:h-6 ${userType === 'admin' ? 'text-indigo-600' : 'text-blue-600'}`} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t('login.title')}</h2>
                  <p className="text-gray-600 text-sm sm:text-base">{t('login.subtitle')}</p>
                </div>
              </div>

              {/* User Type Selection */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  {t('login.loginAs')}
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserType('student')}
                    className={`flex items-center justify-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                      userType === 'student'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{t('login.student')}</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserType('admin')}
                    className={`flex items-center justify-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                      userType === 'admin'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{t('login.admin')}</span>
                  </motion.button>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('login.email')}
                  </label>
                  <input
                    type="email"
                    placeholder={t('login.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('login.password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t('login.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{t('login.rememberMe')}</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 transition"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                    userType === 'admin' 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('login.signingIn')}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {t('login.signInAs', { userType: userType === 'admin' ? t('login.admin') : t('login.student') })}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">{t('login.orContinueWith')}</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Social logins */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('login.google')}
                </button>
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  {t('login.github')}
                </button>
              </div>

              {/* Register link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  {t('login.noAccount')}{" "}
                  <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold transition">
                    {t('login.createAccount')}
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
