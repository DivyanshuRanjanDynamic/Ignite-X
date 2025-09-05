<<<<<<< HEAD
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import StudentDashboard from "./pages/StudentDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import InternshipList from "./pages/InternshipList";
// import InternshipDetail from "./pages/InternshipDetail";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/internships" element={<InternshipList />} />
//         <Route path="/internship/:id" element={<InternshipDetail />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/student-dashboard" element={<StudentDashboard />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Landing";
>>>>>>> 3adf8515dca050b21287ef7b5981013c987815e5
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

/* Student child pages (inside src/pages/student/) */
import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import Recommendation from "./pages/student/Recommendation";
import Applications from "./pages/student/Applications";
import Chatbot from "./pages/student/Chatbot";
import Notifications from "./pages/student/Notifications";
import StudentProgress from "./pages/student/StudentProgress";
import ApplyForm from "./pages/student/ApplyForm"; // ✅ Apply Now
import InternshipDetails from "./pages/student/InternshipDetails"; // ✅ View Details

function App() {
  return (
<<<<<<< HEAD
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/internships" element={<InternshipList />} />
      <Route path="/internship/:id" element={<InternshipDetail />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* Student Dashboard Layout with Nested Pages */}
      <Route path="/student-dashboard" element={<StudentDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="recommendation" element={<Recommendation />} />
        <Route path="applications" element={<Applications />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="progress" element={<StudentProgress />} />
      </Route>

      {/* Apply & View Details Routes */}
      <Route path="/apply/:id" element={<ApplyForm />} />           {/* Apply Now */}
      <Route path="/internship-details/:id" element={<InternshipDetails />} /> {/* View Details */}

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
=======
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
>>>>>>> 3adf8515dca050b21287ef7b5981013c987815e5
  );
}

export default App;




