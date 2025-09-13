/**
 * Quick Actions Menu Component
 * Provides quick actions for resume management
 */

import React, { useState } from 'react';
import { downloadResume, requestReview, getResumeAnalytics } from '../../api/resumes.js';
import { toast } from 'react-hot-toast';

const QuickActionsMenu = ({ resumeId, filename, onAnalyticsOpen }) => {
  const [isLoading, setIsLoading] = useState({
    download: false,
    review: false,
    analytics: false
  });

  /**
   * Handle ATS template download
   * Downloads an ATS-optimized version of the resume with improved formatting
   * for better compatibility with Applicant Tracking Systems
   */
  const handleDownloadATSTemplate = async () => {
    try {
      setIsLoading(prev => ({ ...prev, download: true }));
      
      // Show initial toast for better UX
      const toastId = toast.loading('Generating ATS-optimized template...');
      
      const response = await downloadResume(resumeId, 'ats_template');
      
      // Create blob URL and trigger download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ATS_Optimized_${filename}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Update toast to success
      toast.success('ATS-optimized template downloaded successfully!', {
        id: toastId,
        duration: 3000,
        icon: '✅'
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download ATS template. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, download: false }));
    }
  };

  /**
   * Handle professional review request
   */
  const handleRequestReview = async () => {
    try {
      setIsLoading(prev => ({ ...prev, review: true }));
      
      const response = await requestReview(resumeId);
      
      toast.success('Professional review request submitted! You will be notified when it\'s completed.');
    } catch (error) {
      console.error('Review request failed:', error);
      toast.error('Failed to submit review request');
    } finally {
      setIsLoading(prev => ({ ...prev, review: false }));
    }
  };

  /**
   * Handle analytics view
   */
  const handleViewAnalytics = async () => {
    try {
      setIsLoading(prev => ({ ...prev, analytics: true }));
      
      const response = await getResumeAnalytics(resumeId);
      
      if (onAnalyticsOpen) {
        onAnalyticsOpen(response.data);
      }
    } catch (error) {
      console.error('Analytics failed:', error);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(prev => ({ ...prev, analytics: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>
      
      <div className="space-y-3">
        {/* Download ATS Template */}
        <button
          onClick={handleDownloadATSTemplate}
          disabled={isLoading.download}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading.download ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Downloading...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download ATS-Optimized Template</span>
            </div>
          )}
        </button>

        {/* Get Professional Review */}
        <button
          onClick={handleRequestReview}
          disabled={isLoading.review}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading.review ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Get Professional Review</span>
            </div>
          )}
        </button>

        {/* View Detail Analytics */}
        <button
          onClick={handleViewAnalytics}
          disabled={isLoading.analytics}
          className="w-full flex items-center justify-center px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading.analytics ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>View Detail Analytics</span>
            </div>
          )}
        </button>
      </div>

      {/* Action Descriptions */}
      <div className="mt-6 space-y-3 text-sm text-gray-600">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <p className="font-medium">ATS-Optimized Template</p>
            <p>Download a version optimized for Applicant Tracking Systems</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <p className="font-medium">Professional Review</p>
            <p>Get expert feedback from our career advisors</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <p className="font-medium">Detail Analytics</p>
            <p>View comprehensive ATS scores and recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsMenu;
