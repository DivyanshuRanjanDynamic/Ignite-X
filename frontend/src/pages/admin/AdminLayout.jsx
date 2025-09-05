// src/pages/admin/AdminLayout.jsx
import { Link, Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminLayout() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar - fixed */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-16"> {/* Push content down below navbar */}
        {/* Sidebar - fixed */}
        <aside className="hidden md:block fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-gray-900 text-white p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
          <ul className="space-y-4">
            {/* Dashboard Section */}
            <li>
              <Link to="/admin/overview" className="hover:underline block">
                Overview
              </Link>
            </li>
            <li>
              <Link to="/admin/internship-data" className="hover:underline block">
                Internship Data
              </Link>
            </li>
            <li>
              <Link to="/admin/reports" className="hover:underline block">
                Reports & Exports
              </Link>
            </li>
            <li>
              <Link to="/admin/audit-logs" className="hover:underline block">
                Audit Logs
              </Link>
            </li>

            {/* Divider */}
            <hr className="border-gray-700 my-4" />

            {/* Administration Section */}
            <h3 className="text-sm font-semibold text-gray-400 uppercase">
              Administration
            </h3>
            <li>
              <Link to="/admin/user-management" className="hover:underline block">
                User Management
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" className="hover:underline block">
                Settings
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content - scrollable */}
        <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>

      {/* Footer - fixed for desktop */}
      <div className="hidden md:block bottom-0 left-64 right-0">
        <Footer />
      </div>
    </div>
  );
}
