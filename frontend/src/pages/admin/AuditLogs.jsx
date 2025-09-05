// src/pages/admin/AuditLogs.jsx
import { useState, useEffect } from "react";
import { FaShieldAlt, FaUserCheck, FaListUl } from "react-icons/fa";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [timeRange, setTimeRange] = useState("24h");

  // Simulated API call
  useEffect(() => {
    setTimeout(() => {
      setLogs([
        {
          id: 1,
          event: "User Login",
          category: "User Action",
          time: "2025-09-01 10:12 AM",
          user: "student_01",
        },
        {
          id: 2,
          event: "Internship Created",
          category: "System Event",
          time: "2025-09-01 09:45 AM",
          user: "admin_01",
        },
        {
          id: 3,
          event: "Failed Login Attempt",
          category: "Security Event",
          time: "2025-08-31 08:20 PM",
          user: "unknown",
        },
      ]);
    }, 1000);
  }, []);

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    return (
      (category === "All" || log.category === category) &&
      log.event.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-2 md:p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-blue-700">Audit Logs</h1>
      <p className="text-gray-500 mt-1 mb-8">
        Track and analyze all system activities, user actions, and security
        events
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <FaListUl className="text-blue-600 text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-600">Total Events</h3>
          <p className="text-2xl font-bold text-blue-700 mt-1">{logs.length}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <FaShieldAlt className="text-red-600 text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-600">
            Security Events
          </h3>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {logs.filter((l) => l.category === "Security Event").length}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <FaUserCheck className="text-green-600 text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-600">User Actions</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {logs.filter((l) => l.category === "User Action").length}
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Search & Filter</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="User Action">User Action</option>
            <option value="System Event">System Event</option>
            <option value="Security Event">Security Event</option>
          </select>

          {/* Time Filter */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Recent Activities
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3">Event</th>
                <th className="p-3">Category</th>
                <th className="p-3">User</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3">{log.event}</td>
                  <td className="p-3">{log.category}</td>
                  <td className="p-3">{log.user}</td>
                  <td className="p-3">{log.time}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No logs found for selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
