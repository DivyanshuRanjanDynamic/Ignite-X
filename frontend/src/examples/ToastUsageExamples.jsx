// COMPREHENSIVE TOAST USAGE EXAMPLES
// This file demonstrates how to use the toast system throughout the application

import React, { useState } from 'react';
import { 
  authToasts, 
  adminToasts, 
  appToasts, 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast, 
  showInfoToast, 
  showLoadingToast, 
  showPromiseToast,
  dismissAllToasts
} from '../utils/toast.jsx';

const ToastUsageExamples = () => {
  const [isLoading, setIsLoading] = useState(false);

  // AUTHENTICATION EXAMPLES
  const handleLogin = async () => {
    try {
      // Show loading toast
      const loadingToast = showLoadingToast('Signing in...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success
      authToasts.loginSuccess('John Doe');
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
    } catch (error) {
      authToasts.loginError(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const registerPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5 ? resolve() : reject(new Error('Registration failed'));
        }, 2000);
      });

      // Use promise toast for automatic loading/success/error handling
      await showPromiseToast(registerPromise, {
        loading: 'Creating your account...',
        success: 'Account created successfully! Check your email.',
        error: 'Registration failed. Please try again.'
      });
    } catch (error) {
      // Promise toast handles errors automatically
    }
  };

  const handleOAuthLogin = () => {
    authToasts.oauthSuccess('Google');
  };

  const handleLogout = () => {
    authToasts.logoutSuccess();
  };

  // ADMIN EXAMPLES
  const handleAdminAction = () => {
    adminToasts.actionSuccess('User Management');
  };

  const handleAdminAccess = () => {
    adminToasts.accessGranted();
  };

  const handleAdminDenied = () => {
    adminToasts.accessDenied();
  };

  const handleDataSave = () => {
    adminToasts.dataSaved();
  };

  // APPLICATION EXAMPLES
  const handleFormSubmit = () => {
    appToasts.formSubmitted();
  };

  const handleFileUpload = () => {
    appToasts.fileUploaded('resume.pdf');
  };

  const handleValidationError = () => {
    appToasts.validationError('email');
  };

  const handleNetworkError = () => {
    appToasts.networkError();
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText('https://example.com/share');
    appToasts.copySuccess();
  };

  // CUSTOM TOAST EXAMPLES
  const handleCustomSuccess = () => {
    showSuccessToast('Custom success message! 🎉');
  };

  const handleCustomError = () => {
    showErrorToast('Custom error message! ❌');
  };

  const handleCustomWarning = () => {
    showWarningToast('Custom warning message! ⚠️');
  };

  const handleCustomInfo = () => {
    showInfoToast('Custom info message! ℹ️');
  };

  const handleDismissAll = () => {
    dismissAllToasts();
  };

  // PROMISE EXAMPLE WITH CUSTOM MESSAGES
  const handleAsyncOperation = async () => {
    const asyncOperation = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.3 ? resolve('Data loaded successfully') : reject(new Error('Failed to load data'));
      }, 3000);
    });

    try {
      await showPromiseToast(asyncOperation, {
        loading: 'Fetching user data...',
        success: 'User data loaded successfully! 📊',
        error: (err) => `Failed to load data: ${err.message}`
      });
    } catch (error) {
      // Error handling is automatic with promise toast
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Toast Notification Examples</h1>
      
      {/* Authentication Toasts */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Authentication Toasts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={handleLogin} className="btn btn-primary">Login Success</button>
          <button onClick={handleRegister} className="btn btn-secondary">Register Promise</button>
          <button onClick={handleOAuthLogin} className="btn btn-green">OAuth Success</button>
          <button onClick={handleLogout} className="btn btn-gray">Logout</button>
        </div>
      </section>

      {/* Admin Toasts */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Admin Toasts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={handleAdminAccess} className="btn btn-purple">Access Granted</button>
          <button onClick={handleAdminDenied} className="btn btn-red">Access Denied</button>
          <button onClick={handleAdminAction} className="btn btn-blue">Action Success</button>
          <button onClick={handleDataSave} className="btn btn-green">Data Saved</button>
        </div>
      </section>

      {/* Application Toasts */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Application Toasts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={handleFormSubmit} className="btn btn-green">Form Submit</button>
          <button onClick={handleFileUpload} className="btn btn-blue">File Upload</button>
          <button onClick={handleValidationError} className="btn btn-yellow">Validation Error</button>
          <button onClick={handleNetworkError} className="btn btn-red">Network Error</button>
          <button onClick={handleCopyToClipboard} className="btn btn-gray">Copy Success</button>
        </div>
      </section>

      {/* Custom Toasts */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Custom Toasts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={handleCustomSuccess} className="btn btn-green">Success</button>
          <button onClick={handleCustomError} className="btn btn-red">Error</button>
          <button onClick={handleCustomWarning} className="btn btn-yellow">Warning</button>
          <button onClick={handleCustomInfo} className="btn btn-blue">Info</button>
        </div>
      </section>

      {/* Advanced Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Advanced Examples</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button onClick={handleAsyncOperation} className="btn btn-purple">Async Operation</button>
          <button onClick={handleDismissAll} className="btn btn-gray">Dismiss All</button>
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Usage Instructions</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Import:</strong> <code>import {{ authToasts, adminToasts, appToasts }} from '../utils/toast.jsx';</code></p>
          <p><strong>Success:</strong> <code>authToasts.loginSuccess('John Doe')</code></p>
          <p><strong>Error:</strong> <code>authToasts.loginError('Invalid credentials')</code></p>
          <p><strong>Promise:</strong> <code>showPromiseToast(promise, messages)</code></p>
          <p><strong>Custom:</strong> <code>showSuccessToast('Custom message')</code></p>
        </div>
      </section>
    </div>
  );
};

export default ToastUsageExamples;
