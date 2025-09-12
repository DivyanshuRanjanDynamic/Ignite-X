import React, { useState, useEffect, useCallback } from 'react';
import Joyride, { STATUS, EVENTS, ACTIONS, LIFECYCLE } from 'react-joyride';
import { useTour } from '../contexts/TourContext';
import { tourSteps, joyrideStyles } from '../config/tourSteps.jsx';
import { HelpCircle, X, SkipForward } from 'lucide-react';

const WebsiteTour = () => {
  const {
    isTourOpen,
    stepIndex,
    tourCompleted,
    closeTour,
    completeTour,
    shouldShowTour,
    setStepIndex,
  } = useTour();

  const [run, setRun] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if tour should run on component mount
  useEffect(() => {
    const checkTourStatus = () => {
      setLoading(true);
      
      // Small delay to ensure DOM elements are ready
      setTimeout(() => {
        if (shouldShowTour() && !tourCompleted) {
          console.log('Starting tour - conditions met');
          setRun(true);
        }
        setLoading(false);
      }, 2000); // Increased delay to ensure everything is loaded
    };

    checkTourStatus();
  }, [shouldShowTour, tourCompleted]);

  // Update run state when tour is opened/closed
  useEffect(() => {
    setRun(isTourOpen);
  }, [isTourOpen]);

  const handleJoyrideCallback = useCallback((data) => {
    const { action, index, lifecycle, status, type } = data;

    console.log('Joyride callback:', { action, index, lifecycle, status, type });

    if (([STATUS.FINISHED, STATUS.SKIPPED]).includes(status)) {
      // Tour finished or skipped
      setRun(false);
      completeTour();
      
      // Clear the first login flag
      localStorage.removeItem('isFirstLogin');
      localStorage.removeItem('showTourManually');
    } else if (([STATUS.ERROR]).includes(status)) {
      // Error occurred
      console.error('Tour error:', data);
      setRun(false);
      closeTour();
    } else if (type === EVENTS.STEP_AFTER) {
      // Update step index
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if (type === EVENTS.TARGET_NOT_FOUND) {
      // Target not found, skip this step
      console.warn('Tour target not found:', data);
      setStepIndex(index + 1);
    } else if (action === ACTIONS.CLOSE) {
      // User clicked close button
      setRun(false);
      closeTour();
      localStorage.removeItem('isFirstLogin');
      localStorage.removeItem('showTourManually');
    }
  }, [setStepIndex, closeTour, completeTour]);

  // Don't render anything if loading or tour is completed
  if (loading || (!run && !isTourOpen)) {
    return null;
  }

  // Filter out steps whose targets don't exist
  const availableSteps = tourSteps.filter((step, index) => {
    if (step.target === 'body') return true;
    
    const element = document.querySelector(step.target);
    if (!element) {
      console.warn(`Tour step ${index} target not found: ${step.target}`);
      return false;
    }
    return true;
  });

  return (
    <>
      <Joyride
        callback={handleJoyrideCallback}
        continuous={true}
        run={run}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        steps={availableSteps}
        stepIndex={stepIndex}
        styles={joyrideStyles}
        locale={{
          back: 'Previous',
          close: 'Close',
          last: 'Complete Tour',
          next: 'Next',
          skip: 'Skip Tour',
        }}
        options={{
          primaryColor: '#2563eb',
          width: undefined,
          zIndex: 10000,
          spotlightClicks: false,
          spotlightPadding: 8,
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          beaconSize: 36,
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          textColor: '#374151',
        }}
        floaterProps={{
          disableAnimation: false,
          hideArrow: false,
          offset: 8,
          styles: {
            floater: {
              filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.1))',
            }
          }
        }}
        // tooltipComponent={CustomTooltip}
      />
      
      {/* Import TourHelper component instead - already included in StudentDashboard */}
    </>
  );
};

// Custom tooltip component for better control over styling
const CustomTooltip = ({ 
  continuous, 
  index, 
  step, 
  size, 
  primaryProps, 
  tooltipProps,
  backProps,
  closeProps,
  skipProps
}) => {
  return (
    <div
      className="react-joyride__tooltip"
      {...tooltipProps}
      style={{
        ...tooltipProps.style,
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        minWidth: '300px',
        maxWidth: '400px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))',
      }}
    >
      {/* Progress indicator */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-xs text-gray-500 font-medium">
          Step {index + 1} of {size}
        </div>
        <button
          {...closeProps}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label="Close tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / size) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="react-joyride__tooltip-content mb-6">
        {step.content}
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <div>
          {index > 0 && (
            <button
              {...backProps}
              className="px-4 py-2 text-gray-600 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mr-2 font-medium text-sm"
            >
              Previous
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            {...skipProps}
            className="px-3 py-2 text-red-600 bg-transparent hover:bg-red-50 rounded-lg transition-colors font-medium text-sm flex items-center"
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Skip Tour
          </button>
          
          <button
            {...primaryProps}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            {continuous ? (index === size - 1 ? 'Complete' : 'Next') : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};


export default WebsiteTour;