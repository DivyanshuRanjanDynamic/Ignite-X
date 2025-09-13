import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Upload, FileText, CheckCircle, AlertCircle, XCircle,
  Download, Eye, RefreshCw, Star, Target, TrendingUp,
  Award, Shield, Zap, Users, BarChart3, Trash2, Plus,
  FileImage, File, Calendar, HardDrive, Key, ArrowUpDown
} from "lucide-react";
import { getUserFiles, deleteUserFile } from '../../api/files.js';
import { uploadResume, getResumeAnalytics, downloadResume, requestReview } from '../../api/resumes.js';
import ResumeComparison from '../../components/resume/ResumeComparison';
import { toast } from 'react-hot-toast';
import KeywordExtractor from '../../components/resume/KeywordExtractor';

export default function ResumeUpload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resume');
  const [resumeId, setResumeId] = useState(null);

  // Load user files on component mount
  useEffect(() => {
    loadUserFiles();
  }, []);

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

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await deleteUserFile(fileId);
      if (response.success) {
        toast.success('File deleted successfully');
        loadUserFiles(); // Reload files
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      toast.error('Failed to delete file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('image')) return <FileImage className="w-6 h-6 text-green-600" />;
    if (mimeType.includes('pdf')) return <FileText className="w-6 h-6 text-red-600" />;
    return <File className="w-6 h-6 text-blue-600" />;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'RESUME':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'CERTIFICATE':
        return <Award className="w-5 h-5 text-yellow-600" />;
      case 'ACHIEVEMENT':
        return <Star className="w-5 h-5 text-purple-600" />;
      case 'PROFILE_PICTURE':
        return <FileImage className="w-5 h-5 text-green-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'RESUME':
        return 'bg-blue-100 text-blue-800';
      case 'CERTIFICATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACHIEVEMENT':
        return 'bg-purple-100 text-purple-800';
      case 'PROFILE_PICTURE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    
    try {
      // Upload resume to API
      const uploadResponse = await uploadResume(file);
      
      if (uploadResponse.success) {
        // Get resume ID from response
        const newResumeId = uploadResponse.data.resumeId;
        setResumeId(newResumeId);
        
        // Get ATS analytics
        const analyticsResponse = await getResumeAnalytics(newResumeId);
        
        if (analyticsResponse.success) {
          setAtsScore(analyticsResponse.data);
          toast.success('Resume analyzed successfully');
          loadUserFiles(); // Reload files to show the new resume
        } else {
          toast.error('Failed to analyze resume');
        }
      } else {
        toast.error(uploadResponse.error?.message || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Resume upload/analysis failed:', error);
      toast.error('Resume upload or analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  /**
   * Handle ATS template download
   * Downloads an ATS-optimized version of the resume with improved formatting
   * for better compatibility with Applicant Tracking Systems
   */
  const handleDownloadTemplate = async () => {
    if (!resumeId) {
      toast.error('No resume available for template download');
      return;
    }
    
    try {
      // Show loading toast for better UX
      const toastId = toast.loading('Generating ATS-optimized template...');
      
      const response = await downloadResume(resumeId, 'ats_template');
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ATS_Optimized_${resumeData?.filename || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      // Update toast to success
      toast.success('ATS-optimized template downloaded successfully!', {
        id: toastId,
        duration: 3000,
        icon: '✅'
      });
    } catch (error) {
      console.error('Failed to download template:', error);
      toast.error('Failed to download ATS template. Please try again.');
    }
  };

  const handleRequestReview = async () => {
    if (!resumeId) {
      toast.error('No resume available for review');
      return;
    }
    
    try {
      const response = await requestReview(resumeId);
      
      if (response.success) {
        toast.success('Professional review requested successfully');
      } else {
        toast.error(response.error?.message || 'Failed to request review');
      }
    } catch (error) {
      console.error('Failed to request review:', error);
      toast.error('Failed to request professional review');
    }
  };

  const handleViewAnalytics = () => {
    if (!resumeId) {
      toast.error('No resume analytics available');
      return;
    }
    
    // Navigate to analytics page or open modal
    toast.success('Viewing detailed analytics');
    // Implementation depends on your app's navigation/UI structure
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "good":
        return <Star className="w-5 h-5 text-yellow-500" />;
      case "needs-improvement":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
              <Upload className="w-8 h-8 mr-3 text-blue-600" />
              Resume Upload & ATS Compatibility
            </h1>
            <p className="text-gray-600 mt-2">
              Upload your resume and get instant ATS compatibility analysis
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Resumes Uploaded</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userFiles.filter(f => f.category === 'RESUME').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Certificates</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {userFiles.filter(f => f.category === 'CERTIFICATE').length}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Achievements</p>
                <p className="text-2xl font-bold text-purple-600">
                  {userFiles.filter(f => f.category === 'ACHIEVEMENT').length}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Files</p>
                <p className="text-2xl font-bold text-green-600">{userFiles.length}</p>
              </div>
              <HardDrive className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Upload Area */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Resume</h3>
            
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadedFile ? (
                <div className="space-y-4">
                  <FileText className="w-16 h-16 text-blue-600 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{uploadedFile.name}</p>
                    <p className="text-gray-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      <Eye className="w-4 h-4 mr-2 inline" />
                      Preview
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Drag & drop your resume here
                    </p>
                    <p className="text-gray-600">or click to browse files</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                  >
                    Choose File
                  </label>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ATS Analysis Results */}
          {atsScore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">ATS Analysis Results</h3>
                <div className={`px-4 py-2 rounded-full text-lg font-bold ${getScoreBgColor(atsScore.overallScore)} ${getScoreColor(atsScore.overallScore)}`}>
                  {atsScore.overallScore}%
                </div>
              </div>

              <div className="space-y-4">
                {atsScore.sections.map((section, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(section.status)}
                      <span className="font-medium text-gray-900">{section.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${getScoreColor(section.score)}`}>
                        {section.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analysis Loading */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Resume</h3>
                <p className="text-gray-600">This may take a few moments...</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Analysis & Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* ATS Tips */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-600" />
              ATS Optimization Tips
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Use Standard Section Headers</p>
                  <p className="text-sm text-gray-600">Include "Experience", "Education", "Skills"</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Include Relevant Keywords</p>
                  <p className="text-sm text-gray-600">Match job description keywords</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Use Simple Formatting</p>
                  <p className="text-sm text-gray-600">Avoid complex layouts and graphics</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Save as PDF</p>
                  <p className="text-sm text-gray-600">Ensures consistent formatting</p>
                </div>
              </div>
            </div>
          </div>

          {/* Improvement Suggestions */}
          {atsScore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-600" />
                Improvement Suggestions
              </h3>
              <div className="space-y-3">
                {atsScore.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={handleDownloadTemplate}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                disabled={!resumeId}
              >
                <Download className="w-5 h-5 mr-2" />
                Download ATS-Optimized Template
              </button>
              <button 
                onClick={handleRequestReview}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                disabled={!resumeId}
              >
                <Users className="w-5 h-5 mr-2" />
                Get Professional Review
              </button>
              <button 
                onClick={handleViewAnalytics}
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                disabled={!resumeId}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Detailed Analytics
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* File Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Your Documents</h3>
          <div className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              {userFiles.length} files uploaded
            </span>
          </div>
        </div>

        {/* File Category Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All Files', icon: File },
            { key: 'resume', label: 'Resumes', icon: FileText },
            { key: 'certificate', label: 'Certificates', icon: Award },
            { key: 'achievement', label: 'Achievements', icon: Star },
            { key: 'keywords', label: 'Keywords', icon: Key },
            { key: 'compare', label: 'Compare', icon: ArrowUpDown }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Files Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading your files...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userFiles
              .filter(file => activeTab === 'all' || file.category.toLowerCase() === activeTab)
              .map((file) => (
                <div key={file.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    {getFileIcon(file.mimeType)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(file.category)}`}>
                      {file.category.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2 truncate" title={file.originalName}>
                    {file.originalName}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(file.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <HardDrive className="w-4 h-4 mr-2" />
                      {formatFileSize(file.fileSize)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => window.open(file.fileUrl, '_blank')}
                        className="p-2 text-gray-600 hover:text-blue-600 transition"
                        title="View file"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => window.open(file.fileUrl, '_blank')}
                        className="p-2 text-gray-600 hover:text-green-600 transition"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Keywords Extractor */}
        {activeTab === 'keywords' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <KeywordExtractor 
              resumeId={resumeId} 
              resumeFilename={userFiles.find(f => f.id === resumeId)?.originalName} 
            />
          </div>
        )}

        {/* Resume Comparison */}
        {activeTab === 'compare' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <ResumeComparison 
              userResumes={userFiles.filter(file => file.category === 'RESUME')} 
            />
          </div>
        )}
        
        {/* Empty State */}
        {!loading && activeTab !== 'keywords' && activeTab !== 'compare' && userFiles.filter(file => activeTab === 'all' || file.category.toLowerCase() === activeTab).length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              {activeTab === 'resume' ? <FileText className="w-full h-full" /> :
               activeTab === 'certificate' ? <Award className="w-full h-full" /> :
               activeTab === 'achievement' ? <Star className="w-full h-full" /> :
               <File className="w-full h-full" />}
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab === 'all' ? 'files' : activeTab} uploaded yet
            </h4>
            <p className="text-gray-600 mb-4">
              {activeTab === 'resume' ? 'Upload your resume to get started with ATS analysis' :
               activeTab === 'certificate' ? 'Upload your certificates to showcase your achievements' :
               activeTab === 'achievement' ? 'Upload your achievements to highlight your accomplishments' :
               'Upload files to get started'}
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Plus className="w-4 h-4 mr-2" />
              Upload {activeTab === 'all' ? 'File' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}