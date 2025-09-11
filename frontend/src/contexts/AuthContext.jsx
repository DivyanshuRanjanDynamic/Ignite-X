import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, registerStudent, registerAdmin, logout as logoutApi, verifyEmail, resendVerification, forgotPassword, resetPassword } from '../api/auth';
import api from '../api/client';
import { authToasts } from '../utils/toast.jsx';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const userType = localStorage.getItem('userType');
      const storedUser = localStorage.getItem('user');

      if (accessToken && userType && storedUser) {
        // Verify token is still valid by making a test request
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear storage
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth state check failed:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async ({ email, password, userType = 'student', remember = false }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginApi({ email, password, userType, remember });
      
      if (response.success) {
        const { accessToken, refreshToken, user: userData } = response.data;
        
        // Store tokens and user data
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userType', userData.role.toLowerCase());
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store first login status for tour system
        if (userData.isFirstLogin) {
          localStorage.setItem('isFirstLogin', 'true');
        }

        setUser(userData);
        setIsAuthenticated(true);

        // Dispatch custom event for navbar updates
        window.dispatchEvent(new CustomEvent('authStateChanged', {
          detail: { 
            isAuthenticated: true, 
            userType: userData.role.toLowerCase(), 
            user: userData 
          }
        }));

        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData, userType = 'student') => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (userType === 'admin') {
        response = await registerAdmin(userData);
      } else {
        response = await registerStudent(userData);
      }

      if (response.success) {
        // Auto-login after successful registration
        if (response.data.accessToken) {
          const { accessToken, refreshToken, user: newUser } = response.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userType', newUser.role.toLowerCase());
          localStorage.setItem('user', JSON.stringify(newUser));
          localStorage.setItem('isAuthenticated', 'true');

          setUser(newUser);
          setIsAuthenticated(true);

          // Dispatch custom event
          window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { 
              isAuthenticated: true, 
              userType: newUser.role.toLowerCase(), 
              user: newUser 
            }
          }));
        }

        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API to invalidate tokens on server
      try {
        await logoutApi();
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed:', error);
      }

      // Clear local storage and state
      clearAuthData();

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { isAuthenticated: false, userType: null, user: null }
      }));

      // Show logout success toast
      authToasts.logoutSuccess();

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even on error
      clearAuthData();
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailAddress = async (token) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await verifyEmail(token);
      
      if (response.success) {
        // Update user verification status
        if (user) {
          const updatedUser = { ...user, isVerified: true };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return { success: true };
      } else {
        throw new Error(response.message || 'Email verification failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Email verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resendEmailVerification = async (email) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await resendVerification(email);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Resend verification failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Resend verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotUserPassword = async (email) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await forgotPassword(email);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Password reset request failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Password reset request failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async ({ token, password, confirmPassword }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await resetPassword({ token, password, confirmPassword });
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Password reset failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      
      if (response.data.success) {
        const { accessToken: newAccessToken } = response.data.data;
        localStorage.setItem('accessToken', newAccessToken);
        return { success: true, accessToken: newAccessToken };
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      // If refresh fails, logout user
      clearAuthData();
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { isAuthenticated: false, userType: null, user: null }
      }));
      throw error;
    }
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    verifyEmailAddress,
    resendEmailVerification,
    forgotUserPassword,
    resetUserPassword,
    refreshToken,
    updateUser,
    clearError: () => setError(null),
    checkAuthState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
