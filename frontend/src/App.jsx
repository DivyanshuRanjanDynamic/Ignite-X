
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import InternshipList from "./pages/InternshipList";
import InternshipDetail from "./pages/InternshipDetail";

// Admin components
import AdminLayout from "./pages/admin/AdminLayout";
import Overview from "./pages/admin/Overview";
import InternshipData from "./pages/admin/InternshipData";
import Reports from "./pages/admin/Reports";
import AuditLogs from "./pages/admin/AuditLogs";
import UserManagement from "./pages/admin/UserManagement";
import Settings from "./pages/admin/Settings";

// Student components
import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import Recommendation from "./pages/student/Recommendation";
import Applications from "./pages/student/Applications";
import Chatbot from "./pages/student/Chatbot";
import Notifications from "./pages/student/Notifications";
import StudentProgress from "./pages/student/StudentProgress";
import ApplyForm from "./pages/student/ApplyForm";
import InternshipDetails from "./pages/student/InternshipDetails";
import RecommendedInternships from "./pages/student/RecommendedInternships";
import AppliedInternships from "./pages/student/AppliedInternships";
import RequiredSkills from "./pages/student/RequiredSkills";
import ResumeUpload from "./pages/student/ResumeUpload";

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/internships" element={<InternshipList />} />
      <Route path="/internship/:id" element={<InternshipDetail />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

                  {/* Student Dashboard Layout with Nested Pages */}
            <Route path="/student-dashboard" element={<StudentDashboard />}>
              <Route index element={<RecommendedInternships />} />
              <Route path="recommended-internships" element={<RecommendedInternships />} />
              <Route path="applied-internships" element={<AppliedInternships />} />
              <Route path="required-skills" element={<RequiredSkills />} />
              <Route path="resume-upload" element={<ResumeUpload />} />
              <Route path="profile" element={<Profile />} />
              <Route path="recommendation" element={<Recommendation />} />
              <Route path="applications" element={<Applications />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="progress" element={<StudentProgress />} />
            </Route>

      {/* Admin Dashboard with nested routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="internship-data" element={<InternshipData />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Apply & View Details Routes */}
      <Route path="/apply/:id" element={<ApplyForm />} />
      <Route path="/internship-details/:id" element={<InternshipDetails />} />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
