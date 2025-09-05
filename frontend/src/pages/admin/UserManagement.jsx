// src/pages/admin/UserManagement.jsx
import { useState, useEffect } from "react";
import { FaUsers, FaUserShield, FaUserSlash, FaUserPlus } from "react-icons/fa";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Simulated API call
  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          name: "Ravi Kumar",
          email: "ravi@example.com",
          role: "Student",
          status: "Active",
        },
        {
          id: 2,
          name: "Ananya Singh",
          email: "ananya@example.com",
          role: "Admin",
          status: "Active",
        },
        {
          id: 3,
          name: "Amit Sharma",
          email: "amit@example.com",
          role: "Student",
          status: "Suspended",
        },
        {
          id: 4,
          name: "Priya Das",
          email: "priya@example.com",
          role: "Recruiter",
          status: "Active",
        },
      ]);
    }, 1000);
  }, []);

  // Filtered users
  const filteredUsers = users.filter((user) => {
    return (
      (roleFilter === "All" || user.role === roleFilter) &&
      (statusFilter === "All" || user.status === statusFilter) &&
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-2 md:p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-blue-700">User Management</h1>
      <p className="text-gray-500 mt-1 mb-8">
        Manage user accounts, roles, and permissions across the platform
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <FaUsers className="text-blue-600 text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
          <p className="text-2xl font-bold text-blue-700 mt-1">{users.length}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <FaUsers className="text-green-600 text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-600">Active Users</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {users.filter((u) => u.status === "Active").length}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <FaUserShield className="text-purple-600 text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-600">Admins</h3>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {users.filter((u) => u.role === "Admin").length}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <FaUserSlash className="text-red-600 text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-600">Suspended</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {users.filter((u) => u.status === "Suspended").length}
          </p>
        </div>
      </div>

      {/* Search + Filters + Actions */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <h2 className="text-xl font-bold text-gray-700">Manage Users</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FaUserPlus /> Add New User
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Admin">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                      Suspend
                    </button>
                    <button className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Promote
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No users found for selected filters
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
