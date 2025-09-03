import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminDashboard() {
  // Mock stats (replace with API later)
  const [stats] = useState({
    totalInternships: 12,
    pendingApplications: 18,
    approvedApplications: 45,
  });

  const [applications] = useState([
    { id: 1, student: "Ravi Kumar", internship: "Web Developer Intern", status: "Pending" },
    { id: 2, student: "Ananya Singh", internship: "Data Analyst Intern", status: "Pending" },
    { id: 3, student: "Amit Sharma", internship: "AI/ML Intern", status: "Approved" },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
          <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
          <ul className="space-y-4">
            <li className="hover:underline cursor-pointer">Manage Internships</li>
            <li className="hover:underline cursor-pointer">Approve/Reject Applications</li>
            <li className="hover:underline cursor-pointer">Analytics</li>
            <li className="hover:underline cursor-pointer">Notifications</li>
            <li className="hover:underline cursor-pointer">Settings</li>
            <li className="hover:underline cursor-pointer text-red-300">Logout</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold">Total Internships</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalInternships}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold">Pending Applications</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold">Approved Applications</h3>
              <p className="text-2xl font-bold text-green-600">{stats.approvedApplications}</p>
            </div>
          </div>

          {/* Manage Applications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Applications</h2>
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3">Student</th>
                    <th className="p-3">Internship</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b">
                      <td className="p-3">{app.student}</td>
                      <td className="p-3">{app.internship}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            app.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : app.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Analytics Placeholder */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h2>
            <div className="bg-white p-6 rounded-xl shadow-md text-gray-600">
              <p>📊 Analytics Dashboard Coming Soon...</p>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AdminDashboard;
