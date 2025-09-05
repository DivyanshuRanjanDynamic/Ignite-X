// src/pages/admin/InternshipData.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import { FaBuilding, FaBriefcase, FaTimesCircle } from "react-icons/fa";

export default function InternshipData() {
  // Dummy dynamic data (replace later with API)
  const stats = [
    { title: "Total Internships", value: 5420, icon: <FaBriefcase className="text-blue-600 text-3xl" /> },
    { title: "Active Internships", value: 3890, icon: <FaBuilding className="text-green-600 text-3xl" /> },
    { title: "Expired Companies", value: 210, icon: <FaTimesCircle className="text-red-600 text-3xl" /> },
  ];

  const categoryDistribution = [
    { name: "Tech", value: 65 },
    { name: "Marketing", value: 50 },
    { name: "Design", value: 30 },
    { name: "Finance", value: 40 },
    { name: "HR", value: 20 },
  ];

  const regionalDistribution = [
    { state: "Delhi", value: 30 },
    { state: "Maharashtra", value: 25 },
    { state: "Karnataka", value: 20 },
    { state: "Tamil Nadu", value: 15 },
    { state: "Others", value: 10 },
  ];

  const internshipTrend = [
    { month: "Jan", postings: 300 },
    { month: "Feb", postings: 450 },
    { month: "Mar", postings: 500 },
    { month: "Apr", postings: 400 },
    { month: "May", postings: 600 },
    { month: "Jun", postings: 700 },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Internship Data Management</h1>
        <p className="text-gray-500">
          Monitor and manage all internship listings synced from PM Portal
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
            {item.icon}
          </div>
        ))}
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <div className="space-y-4">
            {categoryDistribution.map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span>{cat.name}</span>
                  <span>{cat.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${cat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Regional Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionalDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Internship Posting Trend */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Internship Posting Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={internshipTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="postings" stroke="#16a34a" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
