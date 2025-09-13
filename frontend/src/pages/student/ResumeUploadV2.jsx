/**
 * Resume Upload Page V2
 * Enhanced resume management with ATS scoring and analytics
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, FileText, CheckCircle, AlertCircle, XCircle,
  Download, Eye, RefreshCw, Star, Target, TrendingUp,
  Award, Shield, Zap, Users, BarChart3, Trash2, Plus,
  FileImage, File, Calendar, HardDrive, Brain, BookOpen
} from 'lucide-react';
import { getUserFiles, deleteUserFile } from '../../api/files.js';
import { toast } from 'react-hot-toast';
import ResumeUploadCard from '../../components/resume/ResumeUploadCard.jsx';
import ResumePreviewModal from '../../components/resume/ResumePreviewModal.jsx';
import QuickActionsMenu from '../../components/resume/QuickActionsMenu.jsx';
import ResumeAnalyticsPanel from '../../components/resume/ResumeAnalyticsPanel.jsx';
import RequiredSkillsGrid from '../../components/resume/RequiredSkillsGrid.jsx';

const ResumeUploadV2 = () => {
  const [userFiles, setUserFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedResume, setSelectedResume] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  /**
   * Load user files on component mount
   */
  useEffect(() => {
    loadUserFiles();
  }, []);

  /**
   * Load user files from API
   */
  const loadUserFiles = async () => {
    try {
      setLoading(true);
      const response = await getUserFiles();
      if (response.success) {
        setUserFiles(response.data.files);
      }
    } catch (error) {
      console.error('Failed to load user files:', error);
      toast.error('Failed to load your files');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle file deletion
   * @param {string} fileId - File ID to delete
   */
  const handleDeleteFile = async (fileId) => {
    try {
      const response = await deleteUserFile(fileId);
      if (response.success) {
        setUserFiles(prev => prev.filter(file => file.id !== fileId));
        toast.success('File deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      toast.error('Failed to delete file');
    }
  };

  /**
   * Handle successful upload
   * @param {Object} uploadResult - Upload result data
   */
  const handleUploadSuccess = (uploadResult) => {
    // Reload files to show the new upload
    loadUserFiles();
    
    // Set the uploaded resume as selected for quick actions
    setSelectedResume({
      id: uploadResult.resumeId,
      filename: uploadResult.originalName || 'Resume'
    });
    
    // Switch to files tab to show the new upload
    setActiveTab('files');
  };

  /**
   * Handle upload error
   * @param {Error} error - Upload error
   */
  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  /**
   * Handle analytics open
   * @param {Object} data - Analytics data
   */
  const handleAnalyticsOpen = (data) => {
    setAnalyticsData(data);
    setShowAnalytics(true);
  };

  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Get file icon based on category
   * @param {string} category - File category
   * @returns {JSX.Element} File icon
   */
  const getFileIcon = (category) => {
    switch (category) {
      case 'RESUME':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'CERTIFICATE':
        return <Award className="w-5 h-5 text-green-500" />;
      case 'ACHIEVEMENT':
        return <Star className="w-5 h-5 text-yellow-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  /**
   * Get category color
   * @param {string} category - File category
   * @returns {string} Color class
   */
  const getCategoryColor = (category) => {
    switch (category) {
      case 'RESUME':
        return 'bg-blue-100 text-blue-800';
      case 'CERTIFICATE':
        return 'bg-green-100 text-green-800';
      case 'ACHIEVEMENT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Upload & ATS Analysis
          </h1>
          <p className="text-gray-600">
            Upload your resume, get ATS scoring, and improve your skills with personalized recommendations.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'upload', label: 'Upload Resume', icon: Upload },
              { id: 'files', label: 'Your Files', icon: FileText },
              { id: 'skills', label: 'Required Skills', icon: BookOpen },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'upload' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Card */}
              <ResumeUploadCard
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />

              {/* Quick Actions */}
              {selectedResume && (
                <QuickActionsMenu
                  resumeId={selectedResume.id}
                  filename={selectedResume.filename}
                  onAnalyticsOpen={handleAnalyticsOpen}
                />
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Resumes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userFiles.filter(f => f.category === 'RESUME').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Award className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Certificates</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userFiles.filter(f => f.category === 'CERTIFICATE').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Achievements</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userFiles.filter(f => f.category === 'ACHIEVEMENT').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <HardDrive className="w-8 h-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Files</p>
                      <p className="text-2xl font-bold text-gray-900">{userFiles.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Files Grid */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : userFiles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
                  <p className="text-gray-600">Upload your first resume to get started with ATS analysis.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userFiles.map((file) => (
                    <div key={file.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.category)}
                          <div>
                            <h3 className="font-medium text-gray-900 truncate">
                              {file.originalName}
                            </h3>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(file.category)}`}>
                              {file.category}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{formatFileSize(file.fileSize)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Uploaded:</span>
                          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedResume({ id: file.id, filename: file.originalName });
                            setShowPreview(true);
                          }}
                          className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <a
                          href={file.fileUrl}
                          download={file.originalName}
                          className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <RequiredSkillsGrid />
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600">Detailed analytics and progress tracking will be available here.</p>
            </div>
          )}
        </motion.div>

        {/* Modals */}
        <ResumePreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          resumeId={selectedResume?.id}
          filename={selectedResume?.filename}
        />

        <ResumeAnalyticsPanel
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          analyticsData={analyticsData}
        />
      </div>
    </div>
  );
};

export default ResumeUploadV2;
