import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Dismiss all existing toasts before showing a new one
const showSingleToast = (toastFn, message, options = {}) => {
  toast.dismiss(); // Remove all existing toasts
  return toastFn(message, options);
};

// Custom toast styling with updated colors and close button
const toastStyles = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#1F2937', // Dark gray
    color: '#F9FAFB', // Light gray
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    padding: '16px 20px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: '400px',
    wordBreak: 'break-word',
  },
  success: {
    duration: 3500,
    style: {
      background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', // Green gradient
      color: '#FFFFFF',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#059669',
    },
  },
  error: {
    duration: 5000,
    style: {
      background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)', // Red gradient
      color: '#FFFFFF',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#DC2626',
    },
  },
  warning: {
    duration: 4000,
    style: {
      background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)', // Orange gradient
      color: '#FFFFFF',
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
  },
  info: {
    duration: 4000,
    style: {
      background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)', // Blue gradient
      color: '#FFFFFF',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    },
  },
  loading: {
    style: {
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', // Purple gradient
      color: '#FFFFFF',
      border: '1px solid rgba(139, 92, 246, 0.3)',
    },
  },
};

// Custom close button component
const CloseButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="ml-3 text-white hover:text-gray-200 transition-colors duration-200"
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
      fontSize: '16px',
      lineHeight: '1',
    }}
    aria-label="Close toast"
  >
    ×
  </button>
);

// Success toasts
export const showSuccessToast = (message) => {
  return showSingleToast(
    toast.success,
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ flex: 1 }}>{message}</span>
      <CloseButton onClick={() => toast.dismiss()} />
    </div>,
    toastStyles.success
  );
};

// Error toasts
export const showErrorToast = (message) => {
  return showSingleToast(
    toast.error,
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ flex: 1 }}>{message}</span>
      <CloseButton onClick={() => toast.dismiss()} />
    </div>,
    toastStyles.error
  );
};

// Loading toasts
export const showLoadingToast = (message) => {
  return showSingleToast(
    toast.loading,
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <span style={{ flex: 1 }}>{message}</span>
    </div>,
    toastStyles.loading
  );
};

// Info toasts
export const showInfoToast = (message) => {
  return showSingleToast(
    toast,
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ flex: 1 }}>ℹ️ {message}</span>
      <CloseButton onClick={() => toast.dismiss()} />
    </div>,
    toastStyles.info
  );
};

// Warning toasts
export const showWarningToast = (message) => {
  return showSingleToast(
    toast,
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ flex: 1 }}>⚠️ {message}</span>
      <CloseButton onClick={() => toast.dismiss()} />
    </div>,
    toastStyles.warning
  );
};

// Custom toast with custom styling
export const showCustomToast = (message, options = {}) => {
  return showSingleToast(
    toast,
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ flex: 1 }}>{message}</span>
      <CloseButton onClick={() => toast.dismiss()} />
    </div>,
    {
      ...toastStyles,
      ...options,
    }
  );
};

// Predefined authentication toasts
export const authToasts = {
  loginSuccess: (userName) => showSuccessToast(`Welcome back, ${userName}! 🎉`),
  loginError: (message) => showErrorToast(message || 'Login failed. Please check your credentials.'),
  logoutSuccess: () => showSuccessToast('Successfully logged out! 👋'),
  
  registerSuccess: () => showSuccessToast('Registration successful! Please check your email for verification. 📧'),
  registerError: (message) => showErrorToast(message || 'Registration failed. Please try again.'),
  
  emailVerified: () => showSuccessToast('Email verified successfully! You can now log in. ✅'),
  emailVerificationError: (message) => showErrorToast(message || 'Email verification failed.'),
  
  passwordResetSent: () => showSuccessToast('Password reset email sent! Check your inbox. 📧'),
  passwordResetError: (message) => showErrorToast(message || 'Failed to send password reset email.'),
  passwordResetSuccess: () => showSuccessToast('Password reset successfully! You can now log in with your new password. ✅'),
  
  oauthSuccess: (provider) => showSuccessToast(`Successfully logged in with ${provider}! 🎉`),
  oauthError: (message) => showErrorToast(message || 'OAuth authentication failed.'),
  
  unauthorized: () => showErrorToast('Access denied. Please log in to continue. 🔒'),
  sessionExpired: () => showWarningToast('Your session has expired. Please log in again. ⏰'),
};

// Predefined admin toasts
export const adminToasts = {
  accessGranted: () => showSuccessToast('Admin access granted! Welcome to the dashboard. 👑'),
  accessDenied: () => showErrorToast('Access denied. Only authorized administrators can access this area. 🚫'),
  actionSuccess: (action) => showSuccessToast(`${action} completed successfully! ✅`),
  actionError: (action, message) => showErrorToast(`${action} failed: ${message || 'Please try again.'}`),
  dataUpdated: () => showSuccessToast('Data updated successfully! 📊'),
  dataSaved: () => showSuccessToast('Changes saved successfully! 💾'),
};

// Predefined application toasts
export const appToasts = {
  formSubmitted: () => showSuccessToast('Form submitted successfully! 📝'),
  formError: (message) => showErrorToast(message || 'Please check the form for errors.'),
  
  fileUploaded: (fileName) => showSuccessToast(`${fileName} uploaded successfully! 📁`),
  fileUploadError: (message) => showErrorToast(message || 'File upload failed.'),
  
  dataLoading: () => showLoadingToast('Loading...'),
  dataError: () => showErrorToast('Failed to load data. Please refresh and try again.'),
  
  networkError: () => showErrorToast('Network error. Please check your connection and try again. 🌐'),
  serverError: () => showErrorToast('Server error. Please try again later. ⚠️'),
  
  validationError: (field) => showErrorToast(`Please check the ${field} field.`),
  requiredField: (field) => showWarningToast(`${field} is required.`),
  
  copySuccess: () => showSuccessToast('Copied to clipboard! 📋'),
  shareSuccess: () => showSuccessToast('Shared successfully! 🔗'),
};

// Promise-based toast for async operations
export const showPromiseToast = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred!',
    },
    {
      success: toastStyles.success,
      error: toastStyles.error,
      loading: toastStyles.loading,
    }
  );
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Update existing toast
export const updateToast = (toastId, message, options = {}) => {
  return toast.success(message, { id: toastId, ...options });
};

// Export Toaster component for App.jsx
export { Toaster };

// Default export
export default toast;
