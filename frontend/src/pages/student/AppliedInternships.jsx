import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Clock, CheckCircle, XCircle, AlertCircle,
  MapPin, Briefcase, Star, Eye, RefreshCw, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AppliedInternships() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data for applied internships with tracking stages
  const appliedInternships = [
    {
      id: 1,
      title: "Digital India Intern",
      company: "Ministry of Electronics & IT",
      location: "Remote",
      type: "Government",
      appliedDate: "2024-01-15",
      status: "Interview",
      currentStage: "Interview",
      stages: [
        { name: "Application Submitted", status: "completed", date: "2024-01-15" },
        { name: "Resume Screening", status: "completed", date: "2024-01-18" },
        { name: "Coding Round", status: "completed", date: "2024-01-22" },
        { name: "Interview", status: "current", date: "2024-01-25" },
        { name: "HR Round", status: "pending", date: null },
        { name: "Final Selection", status: "pending", date: null }
      ],
      match: 95,
      stipend: "₹12,000",
      duration: "3 Months"
    },
    {
      id: 2,
      title: "Rural Development Intern",
      company: "Ministry of Rural Development",
      location: "Delhi",
      type: "Social Impact",
      appliedDate: "2024-01-10",
      status: "Reviewing",
      currentStage: "Resume Screening",
      stages: [
        { name: "Application Submitted", status: "completed", date: "2024-01-10" },
        { name: "Resume Screening", status: "current", date: "2024-01-12" },
        { name: "Coding Round", status: "pending", date: null },
        { name: "Interview", status: "pending", date: null },
        { name: "HR Round", status: "pending", date: null },
        { name: "Final Selection", status: "pending", date: null }
      ],
      match: 92,
      stipend: "₹10,000",
      duration: "6 Months"
    },
    {
      id: 3,
      title: "Skill Development Intern",
      company: "Ministry of Skill Development",
      location: "Mumbai",
      type: "Education",
      appliedDate: "2024-01-05",
      status: "Selected",
      currentStage: "Final Selection",
      stages: [
        { name: "Application Submitted", status: "completed", date: "2024-01-05" },
        { name: "Resume Screening", status: "completed", date: "2024-01-08" },
        { name: "Coding Round", status: "completed", date: "2024-01-12" },
        { name: "Interview", status: "completed", date: "2024-01-18" },
        { name: "HR Round", status: "completed", date: "2024-01-22" },
        { name: "Final Selection", status: "completed", date: "2024-01-25" }
      ],
      match: 88,
      stipend: "₹8,000",
      duration: "4 Months"
    },
    {
      id: 4,
      title: "Healthcare Outreach Intern",
      company: "Ministry of Health & Family Welfare",
      location: "Hyderabad",
      type: "Healthcare",
      appliedDate: "2024-01-20",
      status: "Rejected",
      currentStage: "Resume Screening",
      stages: [
        { name: "Application Submitted", status: "completed", date: "2024-01-20" },
        { name: "Resume Screening", status: "rejected", date: "2024-01-23" },
        { name: "Coding Round", status: "cancelled", date: null },
        { name: "Interview", status: "cancelled", date: null },
        { name: "HR Round", status: "cancelled", date: null },
        { name: "Final Selection", status: "cancelled", date: null }
      ],
      match: 85,
      stipend: "₹9,000",
      duration: "5 Months"
    }
  ];

  const statusFilters = [
    { id: "all", label: "All Applications", count: appliedInternships.length },
    { id: "Reviewing", label: "Under Review", count: appliedInternships.filter(a => a.status === "Reviewing").length },
    { id: "Interview", label: "Interview Stage", count: appliedInternships.filter(a => a.status === "Interview").length },
    { id: "Selected", label: "Selected", count: appliedInternships.filter(a => a.status === "Selected").length },
    { id: "Rejected", label: "Rejected", count: appliedInternships.filter(a => a.status === "Rejected").length }
  ];

  const filteredApplications = selectedStatus === "all" 
    ? appliedInternships 
    : appliedInternships.filter(a => a.status === selectedStatus);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "current":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Reviewing":
        return "bg-yellow-100 text-yellow-800";
      case "Interview":
        return "bg-blue-100 text-blue-800";
      case "Selected":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              <FileText className="w-8 h-8 mr-3 text-blue-600" />
              My Applied Internships
            </h1>
            <p className="text-gray-600 mt-2">
              Track your application progress and status updates
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">{appliedInternships.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {appliedInternships.filter(a => a.status === "Reviewing").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Selected</p>
                <p className="text-2xl font-bold text-green-600">
                  {appliedInternships.filter(a => a.status === "Selected").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((appliedInternships.filter(a => a.status === "Selected").length / appliedInternships.length) * 100)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter by Status</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedStatus(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedStatus === filter.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Applications List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {filteredApplications.map((application, index) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Application Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{application.title}</h3>
                    <p className="text-gray-600 mb-2">{application.company}</p>
                    <div className="flex items-center text-green-600 mb-2">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{application.match}% Match</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    <span className="text-sm">{application.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm">{application.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm font-medium">💰 {application.stipend}/month</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm">⏳ {application.duration}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Applied on: {new Date(application.appliedDate).toLocaleDateString()}
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="lg:col-span-1">
                <h4 className="font-semibold text-gray-900 mb-4">Application Progress</h4>
                <div className="space-y-3">
                  {application.stages.map((stage, stageIndex) => (
                    <div key={stageIndex} className="flex items-center space-x-3">
                      {getStatusIcon(stage.status)}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          stage.status === "completed" ? "text-green-700" :
                          stage.status === "current" ? "text-blue-700" :
                          stage.status === "rejected" || stage.status === "cancelled" ? "text-red-700" :
                          "text-gray-500"
                        }`}>
                          {stage.name}
                        </p>
                        {stage.date && (
                          <p className="text-xs text-gray-500">
                            {new Date(stage.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate(`/internship/${application.id}`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              {application.status === "Selected" && (
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Offer
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredApplications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">Try adjusting your filters or apply to more internships.</p>
        </motion.div>
      )}
    </div>
  );
}