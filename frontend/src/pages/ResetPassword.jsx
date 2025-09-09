import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Key, CheckCircle, XCircle, RefreshCw, Home, Eye, EyeOff, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { resetPassword } from '../api/auth';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [status, setStatus] = useState({ loading: false, success: null, message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    // Component mounted - token will be available from URL params
  }, [token, searchParams]);

  // Password strength validation
  const checkPasswordStrength = (password) => {
    const strength = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    setPasswordStrength(strength);
    return Object.values(strength).every(Boolean);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Check password strength when password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setStatus({ loading: false, success: false, message: 'Reset token is missing.' });
      return;
    }
    if (!form.password || !checkPasswordStrength(form.password)) {
      setStatus({ loading: false, success: false, message: 'Please ensure your password meets all security requirements.' });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setStatus({ loading: false, success: false, message: 'Passwords do not match.' });
      return;
    }

    setStatus({ loading: true, success: null, message: '' });
    try {
      const res = await resetPassword({ token, password: form.password, confirmPassword: form.confirmPassword });
      const msg = res?.message || 'Password reset successfully.';
      setStatus({ loading: false, success: true, message: msg });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || 'Password reset failed. Please try again.';
      setStatus({ loading: false, success: false, message: msg });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600">Enter your new password below.</p>
        </div>

        {status.loading ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-600">Resetting password...</p>
          </div>
        ) : status.success === null ? (
          <form onSubmit={onSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={form.password} 
                  onChange={onChange} 
                  className="w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  placeholder="Enter your new password"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className={`flex items-center gap-2 ${passwordStrength.length ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordStrength.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordStrength.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>One uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordStrength.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>One lowercase letter (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.number ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordStrength.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>One number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.special ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordStrength.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>One special character (!@#$%^&*)</span>
                    </div>
                  </div>
                  
                  {/* Overall Strength Indicator */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Password Strength</span>
                      <span>
                        {Object.values(passwordStrength).filter(Boolean).length}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          Object.values(passwordStrength).filter(Boolean).length === 5 
                            ? 'bg-green-500' 
                            : Object.values(passwordStrength).filter(Boolean).length >= 3
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${(Object.values(passwordStrength).filter(Boolean).length / 5) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword" 
                  value={form.confirmPassword} 
                  onChange={onChange} 
                  className={`w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    form.confirmPassword && form.password !== form.confirmPassword 
                      ? 'border-red-300 bg-red-50' 
                      : form.confirmPassword && form.password === form.confirmPassword
                      ? 'border-green-300 bg-green-50'
                      : ''
                  }`} 
                  placeholder="Confirm your new password"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {form.confirmPassword && (
                <div className={`mt-2 flex items-center gap-2 text-sm ${
                  form.password === form.confirmPassword ? 'text-green-600' : 'text-red-500'
                }`}>
                  {form.password === form.confirmPassword ? 
                    <Check className="w-4 h-4" /> : 
                    <X className="w-4 h-4" />
                  }
                  <span>
                    {form.password === form.confirmPassword ? 
                      'Passwords match' : 
                      'Passwords do not match'
                    }
                  </span>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={!Object.values(passwordStrength).every(Boolean) || form.password !== form.confirmPassword}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Reset Password
            </button>
          </form>
        ) : status.success ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900 mt-3">Success</h2>
            <p className="text-gray-600">{status.message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
          </div>
        ) : (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900 mt-3">Error</h2>
            <p className="text-gray-600">{status.message}</p>
            <div className="mt-4">
              <Link className="px-4 py-2 bg-blue-600 text-white rounded-xl" to="/forgot-password">Try Again</Link>
              <Link className="ml-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700" to="/">
                <Home className="w-4 h-4 inline mr-1"/> Home
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ResetPassword;

