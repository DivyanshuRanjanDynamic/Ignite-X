import React from 'react';
import { HelpCircle, Play, RefreshCw } from 'lucide-react';
import { useTour } from '../contexts/TourContext';

const TourHelper = () => {
  const { startTour, resetTour, tourCompleted } = useTour();

  const handleStartTour = () => {
    localStorage.setItem('showTourManually', 'true');
    startTour();
  };

  const handleResetAndStartTour = () => {
    resetTour();
    localStorage.setItem('showTourManually', 'true');
    localStorage.setItem('isFirstLogin', 'true');
    setTimeout(() => {
      startTour();
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* Main Tour Button */}
      <div className="group relative">
        <button
          onClick={handleStartTour}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
          title="Start Website Tour"
          aria-label="Start Website Tour"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
          {tourCompleted ? 'Restart Website Tour' : 'Start Website Tour'}
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Development Controls */}
      {process.env.NODE_ENV === 'development' && (
        <div className="flex flex-col gap-2">
          <button
            onClick={handleResetAndStartTour}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2 text-xs shadow-md transition-all duration-200 hover:scale-105 flex items-center gap-1"
            title="Reset & Test Tour"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Tour
          </button>
          
          <button
            onClick={() => {
              console.log('Tour State Debug:', {
                tourCompleted: localStorage.getItem('websiteTourCompleted'),
                isFirstLogin: localStorage.getItem('isFirstLogin'),
                showTourManually: localStorage.getItem('showTourManually')
              });
            }}
            className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-3 py-2 text-xs shadow-md transition-all duration-200 hover:scale-105"
            title="Debug Tour State"
          >
            Debug
          </button>
        </div>
      )}
      
      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        .group:hover {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TourHelper;
