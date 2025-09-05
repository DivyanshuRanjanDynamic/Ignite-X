import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Overview() {
  // Mock data (later replace with API calls)
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeInternships: 0,
    applicationsThisMonth: 0,
  });

  const [engagementData, setEngagementData] = useState([]);
  const [skillsGap, setSkillsGap] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalStudents: 12340,
        activeInternships: 320,
        applicationsThisMonth: 870,
      });

      setEngagementData([
        { month: "Jan", students: 400 },
        { month: "Feb", students: 600 },
        { month: "Mar", students: 800 },
        { month: "Apr", students: 1200 },
        { month: "May", students: 900 },
      ]);

      setSkillsGap([
        { skill: "React", percentage: 82 },
        { skill: "Node.js", percentage: 74 },
        { skill: "Python", percentage: 65 },
        { skill: "Machine Learning", percentage: 58 },
        { skill: "Communication", percentage: 91 },
      ]);

      setActivities([
        "20 new students registered today",
        "5 internships pending approval",
        "12 applications reviewed",
        "Server sync completed",
      ]);
    }, 1000);
  }, []);

  return (
    <div className="p-2 md:p-5">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-blue-700">Government Admin Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-8">
        Monitor internship programs and student engagement across India
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Students Registered</h3>
          <p className="text-3xl font-bold text-blue-700 mt-2">{stats.totalStudents}</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-600">Active Internships</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeInternships}</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-600">Applications This Month</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.applicationsThisMonth}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Bar Graph */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Student Engagement Data</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Gap Analysis */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">AI Skills Gap Analysis</h2>
          <div className="space-y-4">
            {skillsGap.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{skill.skill}</span>
                  <span className="text-gray-800 font-semibold">{skill.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Quick Actions */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Internship
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Review Applications
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
              Export Reports
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Activity</h2>
          <ul className="space-y-2 text-gray-600">
            {activities.map((act, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-blue-600">•</span> {act}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
