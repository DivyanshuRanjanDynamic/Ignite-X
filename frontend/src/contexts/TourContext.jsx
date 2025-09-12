import React, { createContext, useContext, useState, useEffect } from 'react';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourCompleted, setTourCompleted] = useState(false);

  // Check if tour was already completed on component mount
  useEffect(() => {
    const completed = localStorage.getItem('websiteTourCompleted');
    if (completed === 'true') {
      setTourCompleted(true);
    }
  }, []);

  const startTour = () => {
    setIsTourOpen(true);
    setStepIndex(0);
  };

  const closeTour = () => {
    setIsTourOpen(false);
    setStepIndex(0);
  };

  const completeTour = () => {
    localStorage.setItem('websiteTourCompleted', 'true');
    setTourCompleted(true);
    setIsTourOpen(false);
    setStepIndex(0);
  };

  const resetTour = () => {
    localStorage.removeItem('websiteTourCompleted');
    setTourCompleted(false);
    setIsTourOpen(false);
    setStepIndex(0);
  };

  const nextStep = () => {
    setStepIndex(prev => prev + 1);
  };

  const prevStep = () => {
    setStepIndex(prev => Math.max(0, prev - 1));
  };

  const goToStep = (step) => {
    setStepIndex(step);
  };

  const shouldShowTour = () => {
    // Show tour if:
    // 1. User is logging in for the first time (detected from auth)
    // 2. Tour hasn't been completed yet
    // 3. User manually requests to see the tour again
    const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';
    return (isFirstLogin && !tourCompleted) || localStorage.getItem('showTourManually') === 'true';
  };

  const value = {
    isTourOpen,
    stepIndex,
    tourCompleted,
    startTour,
    closeTour,
    completeTour,
    resetTour,
    nextStep,
    prevStep,
    goToStep,
    shouldShowTour,
    setIsTourOpen,
    setStepIndex
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};