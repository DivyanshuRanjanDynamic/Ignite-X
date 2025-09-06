import { useNavigate } from "react-router-dom";
import { NavLink, Outlet } from "react-router-dom";
import { 
  Brain, Briefcase, FileText, BookOpen, Upload, 
  CheckCircle, LogOut, User, Settings, Bell, 
  Bubbles
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIAgent from "../components/AIAgent";

const navClass = ({ isActive }) =>
  `flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200
   ${isActive
     ? "bg-blue-600 text-white shadow-lg scale-105"  
     : "text-white hover:bg-blue-500 hover:shadow-md hover:scale-105" 
   }`;

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 bg-blue-700 text-white p-6 hidden md:block shadow-xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-wide flex items-center">
              <Bubbles className="w-4 h-4 mr-3" />
              Student Dashboard
            </h2>
            <p className="text-blue-200 text-md mt-2 font-bold"></p>
          </div>
          
          <nav className="space-y-2">
            <NavLink to="recommended-internships" className={navClass}>
              <Briefcase className="w-5 h-5 mr-3" />
              Recommended Internships
            </NavLink>
            
            <NavLink to="applied-internships" className={navClass}>
              <FileText className="w-5 h-5 mr-3" />
              My Applied Internships
            </NavLink>
            
            <NavLink to="required-skills" className={navClass}>
              <BookOpen className="w-5 h-5 mr-3" />
              Required Skills to Learn
            </NavLink>
            
            <NavLink to="resume-upload" className={navClass}>
              <Upload className="w-5 h-5 mr-3" />
              Resume Upload & ATS
            </NavLink>
          </nav>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-blue-600">
            <div className="text-center">
              <p className="text-blue-200 text-sm">PM Internship Scheme</p>
              <p className="text-blue-300 text-xs">Empowering Students Across India</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg hover:scale-105 transition font-semibold flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 relative">
          <Outlet />
        </main>
      </div>

      <Footer />
      
      {/* AI Agent Component */}
      <AIAgent />
    </div>
  );
}


