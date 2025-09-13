/**
 * Resume Upload Card Component
 * Handles resume upload with drag-and-drop and progress tracking
 */

import React, { useState, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { uploadResume } from '../../api/resumes.js';

const ResumeUploadCard = ({ onUploadSuccess, onUploadError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Supported file types
  const supportedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  /**
   * Handle file selection
   * @param {FileList} files - Selected files
   */
  const handleFileSelect = useCallback(async (files) => {
    const file = files[0];
    
    if (!file) return;

    // Validate file type
    if (!supportedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    await uploadFile(file);
  }, []);

  /**
   * Upload file to server
   * @param {File} file - File to upload
   */
  const uploadFile = async (file) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress (in real implementation, use axios progress callback)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadResume(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success('Resume uploaded and analyzed successfully!');
      
      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }

      // Check for weak skills and show popup
      if (result.data.skillScores) {
        const weakSkills = Object.entries(result.data.skillScores)
          .filter(([_, score]) => score < 90);
        
        if (weakSkills.length > 0) {
          setTimeout(() => {
            showWeakSkillsPopup(weakSkills);
          }, 1000);
        }
      }

    } catch (error) {
      console.error('Upload failed:', error);
      
      let errorMessage = 'Failed to upload resume';
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      }
      
      toast.error(errorMessage);
      
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Show weak skills popup
   * @param {Array} weakSkills - Array of weak skills
   */
  const showWeakSkillsPopup = (weakSkills) => {
    const skillNames = weakSkills.map(([skill, score]) => `${skill} (${score}%)`).join(', ');
    
    toast(
      <div className="text-center">
        <p className="font-semibold text-red-600 mb-2">Skills Need Improvement</p>
        <p className="text-sm mb-3">Your resume shows weak scores in: {skillNames}</p>
        <button
          onClick={() => window.location.href = '/student/required-skills'}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          View Required Skills
        </button>
      </div>,
      {
        duration: 8000,
        position: 'top-center'
      }
    );
  };

  /**
   * Handle drag events
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFileSelect(files);
  };

  /**
   * Open file dialog
   */
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Upload Your Resume
      </h3>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">Uploading and Analyzing...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto text-gray-400">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragging ? 'Drop your resume here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PDF, DOC, or DOCX files up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Upload Tips */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Upload Tips:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use a clear, professional format</li>
          <li>• Include relevant keywords for your field</li>
          <li>• Keep file size under 10MB</li>
          <li>• We'll analyze your resume for ATS compatibility</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUploadCard;
