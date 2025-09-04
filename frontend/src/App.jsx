import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InternshipList from "./pages/InternshipList";
import InternshipDetail from "./pages/InternshipDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/internships" element={<InternshipList />} />
        <Route path="/internship/:id" element={<InternshipDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboards" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
