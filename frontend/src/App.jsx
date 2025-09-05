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
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InternshipList from "./pages/InternshipList";
import InternshipDetail from "./pages/InternshipDetail";

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
  );
}

export default App;




