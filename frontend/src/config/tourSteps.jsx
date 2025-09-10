import React from 'react';
import { Brain, Briefcase, FileText, BookOpen, Upload, User } from "lucide-react";

// Tour steps configuration for the student dashboard
export const tourSteps = [
  {
    target: 'body',
    content: (
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to PM Internship AI! 🎉</h2>
        <p className="text-gray-600 mb-4">
          We're excited to help you find the perfect internship opportunities! 
          Let's take a quick tour of your personalized dashboard.
        </p>
        <p className="text-sm text-blue-600 font-medium">
          This tour will take about 2 minutes. You can skip it anytime!
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
    styles: {
      options: {
        primaryColor: '#2563eb',
        width: 400,
        zIndex: 10000,
      },
    },
  },
  {
    target: '[data-tour="sidebar"]',
    content: (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Navigation Hub 🧭</h3>
        <p className="text-gray-600 mb-3">
          This is your main navigation sidebar. Here you can access all the key features:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-blue-600" /> Recommended Internships</li>
          <li className="flex items-center"><FileText className="w-4 h-4 mr-2 text-green-600" /> Applied Internships</li>
          <li className="flex items-center"><BookOpen className="w-4 h-4 mr-2 text-purple-600" /> Required Skills</li>
          <li className="flex items-center"><Upload className="w-4 h-4 mr-2 text-orange-600" /> Resume Upload</li>
        </ul>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="recommended-internships"]',
    content: (
      <div>
        <div className="flex items-center mb-3">
          <Briefcase className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations 🤖</h3>
        </div>
        <p className="text-gray-600 mb-3">
          Our AI analyzes your profile, skills, and preferences to suggest the most relevant internships for you.
        </p>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Pro Tip:</strong> The more complete your profile, the better our recommendations!
          </p>
        </div>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="applied-internships"]',
    content: (
      <div>
        <div className="flex items-center mb-3">
          <FileText className="w-6 h-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Track Your Applications 📊</h3>
        </div>
        <p className="text-gray-600 mb-3">
          Keep track of all your internship applications in one place. See the status, deadlines, and next steps.
        </p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• View application status</li>
          <li>• Track response times</li>
          <li>• Manage follow-ups</li>
        </ul>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="required-skills"]',
    content: (
      <div>
        <div className="flex items-center mb-3">
          <BookOpen className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Skill Development 📚</h3>
        </div>
        <p className="text-gray-600 mb-3">
          Discover what skills are in demand for your desired internships and get personalized learning recommendations.
        </p>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-purple-800">
            Stay competitive by continuously upgrading your skillset!
          </p>
        </div>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="resume-upload"]',
    content: (
      <div>
        <div className="flex items-center mb-3">
          <Upload className="w-6 h-6 text-orange-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Resume Management 📄</h3>
        </div>
        <p className="text-gray-600 mb-3">
          Upload and manage your resume. Our AI will analyze it and suggest improvements to make it more attractive to employers.
        </p>
        <div className="bg-orange-50 p-3 rounded-lg">
          <p className="text-sm text-orange-800">
            <strong>Tip:</strong> Keep your resume updated with your latest projects and achievements!
          </p>
        </div>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="ai-agent"]',
    content: (
      <div>
        <div className="flex items-center mb-3">
          <Brain className="w-6 h-6 text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Your AI Assistant 🤖</h3>
        </div>
        <p className="text-gray-600 mb-3">
          Need help? Our AI assistant is here 24/7 to answer questions about internships, career advice, and platform features.
        </p>
        <div className="bg-indigo-50 p-3 rounded-lg">
          <p className="text-sm text-indigo-800">
            Try asking: "What internships match my profile?" or "How can I improve my application?"
          </p>
        </div>
      </div>
    ),
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '[data-tour="mobile-nav"]',
    content: (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Navigation 📱</h3>
        <p className="text-gray-600 mb-3">
          On mobile devices, you'll find all your navigation options in this convenient bottom menu.
        </p>
        <p className="text-sm text-gray-500">
          All the same features, optimized for your phone or tablet!
        </p>
      </div>
    ),
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">You're All Set! 🎊</h2>
        <p className="text-gray-600 mb-4">
          Congratulations! You've completed the tour and are ready to start your internship journey.
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-4 rounded-lg">
          <p className="text-sm text-gray-800 mb-2">
            <strong>Next Steps:</strong>
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>1. Complete your profile for better recommendations</li>
            <li>2. Upload your latest resume</li>
            <li>3. Browse and apply to internships</li>
            <li>4. Use the AI assistant whenever you need help</li>
          </ul>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          You can always restart this tour from your profile settings.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
    styles: {
      options: {
        primaryColor: '#16a34a',
        width: 420,
        zIndex: 10000,
      },
    },
  },
];

// Default Joyride styles that match the application theme
export const joyrideStyles = {
  options: {
    primaryColor: '#2563eb',
    backgroundColor: '#ffffff',
    textColor: '#374151',
    width: 350,
    zIndex: 10000,
  },
  tooltip: {
    borderRadius: 12,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: 20,
  },
  tooltipContainer: {
    textAlign: 'left',
  },
  tooltipTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  },
  tooltipContent: {
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: '1.5',
  },
  buttonNext: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 16px',
    border: 'none',
    outline: 'none',
  },
  buttonBack: {
    color: '#6b7280',
    backgroundColor: 'transparent',
    borderRadius: 8,
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    marginRight: 8,
  },
  buttonSkip: {
    color: '#ef4444',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 16px',
  },
  buttonClose: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    borderRadius: 20,
    width: 24,
    height: 24,
    border: 'none',
    padding: 0,
    fontSize: '16px',
    fontWeight: 'bold',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(2px)',
  },
  spotlight: {
    borderRadius: 8,
  },
  beacon: {
    backgroundColor: '#2563eb',
  },
  beaconInner: {
    backgroundColor: '#3b82f6',
  },
  beaconOuter: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    border: '2px solid rgba(37, 99, 235, 0.3)',
  },
};
