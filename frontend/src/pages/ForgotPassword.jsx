import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  ArrowLeft, 
  Send, 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  RefreshCw, 
  Clock,
  Home,
  Brain,
  ArrowRight
} from "lucide-react";
import { useAuthTranslation } from '../hooks/useTranslation.jsx';

function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useAuthTranslation();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      startTimer();
      console.log("OTP sent to:", formData.email);
    }, 2000);
  };

  // Start countdown timer
  const startTimer = () => {
    setTimeLeft(300);
    setCanResend(false);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (formData.otp === "123456") { // Demo OTP
        setStep(3);
        setErrors({});
      } else {
        setErrors({ otp: "Invalid OTP. Please try again." });
      }
    }, 1500);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(4); // Success step
      console.log("Password reset successful");
    }, 2000);
  };

  // Resend OTP
  const handleResendOTP = () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      startTimer();
      console.log("OTP resent to:", formData.email);
    }, 1000);
  };

  // Format timer display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get password strength
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return { text: "Very Weak", color: "text-red-500" };
      case 2: return { text: "Weak", color: "text-orange-500" };
      case 3: return { text: "Fair", color: "text-yellow-500" };
      case 4: return { text: "Good", color: "text-blue-500" };
      case 5: return { text: "Strong", color: "text-green-500" };
      default: return { text: "Very Weak", color: "text-red-500" };
    }
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

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600">
              {step === 1 && "Enter your email to receive a reset code"}
              {step === 2 && "Enter the verification code sent to your email"}
              {step === 3 && "Create a new secure password"}
              {step === 4 && "Password reset successful!"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step >= stepNum
                      ? "bg-blue-600 text-white"
                      : step === stepNum
                      ? "bg-blue-100 text-blue-600 ring-2 ring-blue-600"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > stepNum ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    stepNum
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Enter Email */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSendOTP}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Reset Code
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-800 text-sm transition"
                    >
                      ← Back to Login
                    </Link>
                  </div>
                </motion.form>
              )}

              {/* Step 2: Verify OTP */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                      We've sent a 6-digit verification code to
                      <br />
                      <strong className="text-gray-900">{formData.email}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter 6-digit code"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength="6"
                      className={`w-full px-4 py-3 border rounded-xl text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.otp ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {errors.otp && (
                      <p className="mt-1 text-sm text-red-500">{errors.otp}</p>
                    )}
                  </div>

                  {/* Timer and Resend */}
                  <div className="text-center">
                    {!canResend ? (
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        Code expires in {formatTime(timeLeft)}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-blue-600 hover:text-blue-800 text-sm transition disabled:opacity-50"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Verify Code
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gray-600 hover:text-gray-800 text-sm transition"
                    >
                      ← Change Email Address
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 3: Reset Password */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleResetPassword}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.newPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                    )}
                    
                    {/* Password Strength Indicator */}
                    {formData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Password Strength:</span>
                          <span className={getPasswordStrengthText(getPasswordStrength(formData.newPassword)).color}>
                            {getPasswordStrengthText(getPasswordStrength(formData.newPassword)).text}
                          </span>
                        </div>
                        <div className="flex space-x-1 mt-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full ${
                                getPasswordStrength(formData.newPassword) >= level
                                  ? level <= 2 ? "bg-red-400" : level <= 3 ? "bg-yellow-400" : "bg-green-400"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <Key className="w-5 h-5 mr-2" />
                        Reset Password
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Password Reset Successful!
                    </h3>
                    <p className="text-gray-600">
                      Your password has been successfully reset. You can now log in with your new password.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                    >
                      Continue to Login
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    
                    <Link
                      to="/"
                      className="block w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition text-center"
                    >
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Demo Info */}
          {step === 2 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 text-center">
                <strong>Demo:</strong> Use OTP <strong>123456</strong> to proceed
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;
