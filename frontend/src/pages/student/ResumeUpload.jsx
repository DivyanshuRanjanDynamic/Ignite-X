import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Upload, FileText, CheckCircle, AlertCircle, XCircle,
  Download, Eye, RefreshCw, Star, Target, TrendingUp,
  Award, Shield, Zap, Users, BarChart3
} from "lucide-react";

export default function ResumeUpload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mock ATS analysis data
  const atsAnalysis = {
    overallScore: 85,
    sections: [
      { name: "Contact Information", score: 95, status: "excellent" },
      { name: "Professional Summary", score: 80, status: "good" },
      { name: "Work Experience", score: 90, status: "excellent" },
      { name: "Education", score: 100, status: "excellent" },
      { name: "Skills", score: 75, status: "good" },
      { name: "Keywords Match", score: 70, status: "needs-improvement" },
      { name: "Formatting", score: 85, status: "good" },
      { name: "Length", score: 90, status: "excellent" }
    ],
    suggestions: [
      "Add more industry-specific keywords to improve ATS compatibility",
      "Consider adding a skills section with technical proficiencies",
      "Include quantifiable achievements in your work experience",
      "Ensure consistent formatting throughout the document"
    ],
    improvements: [
      "Add 5-7 more relevant keywords",
      "Include 2-3 quantifiable achievements",
      "Optimize for mobile viewing",
      "Add a professional summary section"
    ]
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setAtsScore(atsAnalysis);
      setIsAnalyzing(false);
    }, 3000);
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
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Best ATS Score</p>
                <p className="text-2xl font-bold text-green-600">85%</p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Improvements Made</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Applications Sent</p>
                <p className="text-2xl font-bold text-orange-600">8</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
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
              <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <Download className="w-5 h-5 mr-2" />
                Download ATS-Optimized Template
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Users className="w-5 h-5 mr-2" />
                Get Professional Review
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Detailed Analytics
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Resume History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Resume History</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Resume_v3.pdf", date: "2024-01-25", score: 85, status: "Current" },
            { name: "Resume_v2.pdf", date: "2024-01-20", score: 72, status: "Previous" },
            { name: "Resume_v1.pdf", date: "2024-01-15", score: 65, status: "Previous" }
          ].map((resume, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  resume.status === "Current" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {resume.status}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{resume.name}</h4>
              <p className="text-sm text-gray-600 mb-3">Uploaded: {resume.date}</p>
              <div className="flex items-center justify-between">
                <span className={`font-bold ${getScoreColor(resume.score)}`}>
                  {resume.score}% ATS Score
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 transition">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}