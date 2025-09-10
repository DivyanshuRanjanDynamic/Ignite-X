import React from 'react';

const SecurityLoadingAnimation = ({ isActive = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-2 border-blue-200 rounded-full animate-spin">
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        
        {/* Security shield overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-blue-600">
            <path 
              fill="currentColor" 
              d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5H16.5V18H7.5V11.5H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11.5H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SecurityLoadingAnimation;
