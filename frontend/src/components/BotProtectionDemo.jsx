import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Activity, MousePointer, Keyboard, Eye, Clock, Lock } from 'lucide-react';

const BotProtectionDemo = () => {
  const [demoScore, setDemoScore] = useState(0);
  const [demoStatus, setDemoStatus] = useState('pending');

  useEffect(() => {
    // Simulate security score progression
    const interval = setInterval(() => {
      setDemoScore(prev => {
        const newScore = Math.min(prev + 5, 85);
        if (newScore >= 70) setDemoStatus('protected');
        return newScore;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (demoStatus) {
      case 'protected': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default: return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  const getSecurityBarColor = () => {
    if (demoScore >= 80) return 'bg-emerald-500';
    if (demoScore >= 60) return 'bg-blue-500';
    if (demoScore >= 40) return 'bg-yellow-500';
    if (demoScore >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreText = () => {
    if (demoScore >= 80) return { text: 'Excellent', color: 'text-emerald-600' };
    if (demoScore >= 60) return { text: 'Good', color: 'text-blue-600' };
    if (demoScore >= 40) return { text: 'Fair', color: 'text-yellow-600' };
    if (demoScore >= 20) return { text: 'Poor', color: 'text-orange-600' };
    return { text: 'Very Low', color: 'text-red-600' };
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Bot Protection UI</h1>
        <p className="text-gray-600">Modern, intuitive security verification interface</p>
      </div>

      <div className="space-y-6">
        {/* Main Security Status Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className={`px-6 py-4 border-b ${getStatusColor()}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {demoStatus === 'protected' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {demoStatus === 'protected' ? 'Security verification completed' : 'Analyzing your behavior patterns...'}
                  </h3>
                  <p className="text-xs opacity-80 mt-0.5">
                    {demoStatus === 'protected' ? 'Your account is secure' : 'Please interact with the form naturally'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getScoreText().color}`}>
                  {demoScore}/100
                </div>
                <div className={`text-xs font-medium ${getScoreText().color}`}>
                  {getScoreText().text}
                </div>
              </div>
            </div>
          </div>


        {/* reCAPTCHA Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-gray-700 mb-2">
              <Lock className="w-5 h-5" />
              <span className="font-medium">Human Verification</span>
            </div>
            <p className="text-sm text-gray-500">
              Complete this step to verify you're not a robot
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-3">
            <div className="w-64 h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">reCAPTCHA Widget Placeholder</span>
            </div>
            
            {demoStatus === 'protected' ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Verification completed!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Click the checkbox above</span>
              </div>
            )}
          </div>
        </div>
      {/* Improvement Highlights */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ UI Improvements Made</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">+</span>
              <span>Modern card-based layout with clean shadows</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">+</span>
              <span>Dynamic security score visualization</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">+</span>
              <span>Interactive behavior analytics dashboard</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">+</span>
              <span>Improved color-coded status indicators</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">+</span>
              <span>Better visual hierarchy and typography</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">+</span>
              <span>Responsive design for all screen sizes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">+</span>
              <span>Enhanced user feedback and messaging</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">+</span>
              <span>Professional gradient backgrounds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotProtectionDemo;
