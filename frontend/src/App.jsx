
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import './i18n'; // Initialize i18n
import { LanguageProvider } from './contexts/LanguageContext';
import ScrollToTop from './components/ScrollToTop';
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import StudentDashboard from "./pages/StudentDashboard";
import InternshipList from "./pages/InternshipList";
import InternshipDetail from "./pages/InternshipDetail";

// Admin components
import AdminLayout from "./pages/admin/AdminLayout";
import SimpleOverview from "./pages/admin/SimpleOverview";
import InternshipData from "./pages/admin/InternshipData";
import SimpleUserManagement from "./pages/admin/SimpleUserManagement";
import AdminProfile from "./pages/admin/AdminProfile";
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

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600">Loading translations...</p>
    </div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/internships" element={<InternshipList />} />
      <Route path="/internship/:id" element={<InternshipDetail />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

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
        <Route index element={<SimpleOverview />} />
        <Route path="overview" element={<SimpleOverview />} />
        <Route path="internship-data" element={<InternshipData />} />
        <Route path="user-management" element={<SimpleUserManagement />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Apply & View Details Routes */}
      <Route path="/apply/:id" element={<ApplyForm />} />
      <Route path="/internship-details/:id" element={<InternshipDetails />} />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </LanguageProvider>
  );
}

export default App;
