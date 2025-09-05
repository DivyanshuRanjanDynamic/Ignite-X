// src/pages/admin/Reports.jsx
import { useState } from "react";
import { FaFileAlt, FaClock, FaDownload, FaSync } from "react-icons/fa";

export default function Reports() {
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("✅ Report generated successfully!");
    }, 1500);
  };

  return (
    <div className="p-2 md:p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-blue-700">Reports & Exports</h1>
      <p className="text-gray-500 mt-1 mb-8">
        Generate comprehensive reports and export data for analysis
      </p>

      {/* Custom Report Generator */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaFileAlt className="text-blue-600" />
          Custom Report Generator
        </h2>
        <p className="text-gray-500 mb-4">
          Select parameters and generate tailored reports instantly.
        </p>
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Scheduled Reports */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaClock className="text-yellow-600" />
            Scheduled Reports
          </h2>
          <p className="text-gray-500 mb-4">
            Automate report delivery on a daily, weekly, or monthly basis.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Weekly Internship Summary</li>
            <li>Monthly Student Engagement</li>
            <li>Quarterly Skills Analysis</li>
          </ul>
        </div>

        {/* Quick Exports */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaDownload className="text-green-600" />
            Quick Exports
          </h2>
          <p className="text-gray-500 mb-4">
            Download pre-defined data exports in one click.
          </p>
          <div className="space-x-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* PM Portal Integration */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaSync className="text-purple-600" />
          PM Portal Integration
        </h2>
        <p className="text-gray-500 mb-4">
          Sync reports and analytics directly with the PM Portal for
          cross-department usage.
        </p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Sync Now
        </button>
      </div>
    </div>
  );
}
