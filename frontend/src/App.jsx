import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import Overview from "./pages/admin/Overview";
import InternshipData from "./pages/admin/InternshipData";
import Reports from "./pages/admin/Reports";
import AuditLogs from "./pages/admin/AuditLogs";
import UserManagement from "./pages/admin/UserManagement";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Admin Dashboard with nested routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Default when visiting /admin → Overview */}
          <Route index element={<Overview />} />

          <Route path="overview" element={<Overview />} />
          <Route path="internship-data" element={<InternshipData />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Optional: catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
