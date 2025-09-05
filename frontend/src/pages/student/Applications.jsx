// src/pages/student/Applications.jsx
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Applications() {
  const applications = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "Tech Solutions",
      status: "Under Review",
      date: "15 Aug 2025",
    },
    {
      id: 2,
      title: "AI Research Intern",
      company: "Innovate AI Labs",
      status: "Accepted",
      date: "10 Aug 2025",
    },
    {
      id: 3,
      title: "Full Stack Developer Intern",
      company: "NextGen Web",
      status: "Rejected",
      date: "05 Aug 2025",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-600 bg-green-100 border-green-300";
      case "Rejected":
        return "text-red-600 bg-red-100 border-red-300";
      case "Under Review":
        return "text-yellow-600 bg-yellow-100 border-yellow-300";
      default:
        return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle size={18} className="mr-2 text-green-600" />;
      case "Rejected":
        return <XCircle size={18} className="mr-2 text-red-600" />;
      case "Under Review":
        return <Clock size={18} className="mr-2 text-yellow-600" />;
      default:
        return <FileText size={18} className="mr-2 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">📑 My Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-600">No applications submitted yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-2xl hover:scale-105 transition transform duration-300 ease-in-out"
            >
              {/* Job Title & Company */}
              <h3 className="text-lg font-semibold text-gray-900">{app.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{app.company}</p>

              {/* Status */}
              <div
                className={`flex items-center px-3 py-1 rounded-lg border w-fit text-sm font-medium ${getStatusStyle(
                  app.status
                )}`}
              >
                {getStatusIcon(app.status)}
                {app.status}
              </div>

              {/* Date */}
              <p className="text-gray-600 text-sm mt-3">
                📅 Applied on: <span className="font-medium">{app.date}</span>
              </p>

              {/* View Details Button */}
              <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition duration-300">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


