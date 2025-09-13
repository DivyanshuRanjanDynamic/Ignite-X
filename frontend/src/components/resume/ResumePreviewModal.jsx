/**
 * Resume Preview Modal Component
 * Displays resume preview in a modal with download options
 */

import React, { useState, useEffect } from 'react';
import { getResumePreview, downloadResume } from '../../api/resumes.js';
import { toast } from 'react-hot-toast';

const ResumePreviewModal = ({ isOpen, onClose, resumeId, filename }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load preview URL when modal opens
   */
  useEffect(() => {
    if (isOpen && resumeId) {
      loadPreview();
    }
  }, [isOpen, resumeId]);

  /**
   * Load resume preview
   */
  const loadPreview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getResumePreview(resumeId);
      setPreviewUrl(response.data.previewUrl);
    } catch (error) {
      console.error('Failed to load preview:', error);
      setError('Failed to load resume preview');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle download of resume files
   * @param {string} type - Download type ('original' or 'ats_template')
   */
  const handleDownload = async (type = 'original') => {
    try {
      // Show loading toast for better UX
      const isAtsTemplate = type === 'ats_template';
      const toastId = toast.loading(
        isAtsTemplate ? 'Generating ATS-optimized template...' : 'Preparing download...'
      );
      
      const response = await downloadResume(resumeId, type);
      
      // Create blob URL and trigger download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const downloadName = isAtsTemplate
        ? `ATS_Optimized_${filename}` 
        : filename;
      
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Update toast to success
      toast.success(
        `${isAtsTemplate ? 'ATS-optimized' : 'Original'} resume downloaded successfully!`,
        {
          id: toastId,
          duration: 3000,
          icon: '✅'
        }
      );
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download resume. Please try again.');
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    setPreviewUrl(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Resume Preview: {filename}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload('original')}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Download Original
                </button>
                <button
                  onClick={() => handleDownload('ats_template')}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                >
                  Download ATS Template
                </button>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-4 pb-4 sm:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={loadPreview}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : previewUrl ? (
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-96"
                  title="Resume Preview"
                  onError={() => setError('Failed to load preview')}
                />
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewModal;
