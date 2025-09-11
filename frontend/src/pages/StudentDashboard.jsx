import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink, Outlet } from "react-router-dom";
import { 
  Brain, Briefcase, FileText, BookOpen, Upload, 
  CheckCircle, LogOut, User, Settings, Bell, 
  Bubbles, Menu, X, Home, ChevronDown
} from "lucide-react";
import Navbar from "../components/Navbar";
import AIAgent from "../components/AIAgent";
import WebsiteTour from "../components/WebsiteTour";
import TourHelper from "../components/TourHelper";

const navClass = ({ isActive }) =>
  `flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200
   ${isActive
     ? "bg-blue-600 text-white shadow-lg scale-105"  
     : "text-white hover:bg-blue-500 hover:shadow-md hover:scale-105" 
   }`;

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to top when nested routes change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    
    // Dispatch custom event to notify navbar
    window.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { isAuthenticated: false, userType: null, userName: null }
    }));
    
    navigate("/");
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation items for easier management
  const navigationItems = [
    {
      to: "recommended-internships",
      icon: Briefcase,
      label: "Recommended",
      fullLabel: "Recommended Internships"
    },
    {
      to: "applied-internships",
      icon: FileText,
      label: "Applied",
      fullLabel: "Applied Internships"
    },
    {
      to: "required-skills",
      icon: BookOpen,
      label: "Skills",
      fullLabel: "Required Skills"
    },
    {
      to: "resume-upload",
      icon: Upload,
      label: "Resume",
      fullLabel: "Resume Upload"
    }
  ];

  const SidebarContent = () => (
    <>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold tracking-wide flex items-center">
          <Bubbles className="w-4 h-4 mr-2 sm:mr-3" />
          <span className="hidden sm:inline">Student Dashboard</span>
          <span className="sm:hidden">Dashboard</span>
        </h2>
        <p className="text-blue-200 text-sm mt-1 sm:mt-2">PM Internship AI</p>
      </div>
      
      <nav className="space-y-1 sm:space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={navClass}
              onClick={closeMobileSidebar}
              data-tour={item.to}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              <span className="text-sm sm:text-base">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer - Hidden on mobile */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-blue-600 hidden sm:block">
        <div className="text-center">
          <p className="text-blue-200 text-sm">PM Internship Scheme</p>
          <p className="text-blue-300 text-xs">Empowering Students Across India</p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-4 sm:mt-6 w-full py-2 sm:py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg hover:scale-105 transition font-semibold flex items-center justify-center text-sm sm:text-base"
      >
        <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
        Logout
      </button>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Top Navbar */}
      <Navbar />


      <div className="flex flex-1 relative">
        

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMobileSidebar}
          />
        )}

        {/* Mobile Sidebar */}
        <aside className={`md:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Bubbles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Dashboard</h2>
                <p className="text-blue-100 text-xs">Student Portal</p>
              </div>
            </div>
            <button
              onClick={closeMobileSidebar}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mobile navigation */}
          <div className="p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.includes(item.to);
                return (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    onClick={closeMobileSidebar}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">{item.fullLabel}</div>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
            
            {/* Mobile sidebar footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-blue-800 font-medium text-sm">PM Internship Scheme</p>
                <p className="text-blue-600 text-xs">Empowering Students Across India</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg transition font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 lg:w-72 bg-blue-700 text-white p-4 lg:p-6 shadow-xl" data-tour="sidebar">
          <SidebarContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 md:p-8 lg:p-10 relative">
          {/* Mobile: Content with proper spacing */}
          <div className="md:hidden">
            <div className="p-4 pb-20"> {/* Bottom padding for mobile bottom nav */}
              <Outlet />
            </div>
          </div>
          
          {/* Desktop: Normal layout */}
          <div className="hidden md:block">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30" data-tour="mobile-nav">
        <div className="grid grid-cols-4 gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.to);
            return (
              <NavLink 
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center p-3 transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`} />
                <span className={`text-xs font-medium ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
      
      {/* AI Agent Component */}
      <div data-tour="ai-agent">
        <AIAgent />
      </div>
      
      {/* Website Tour Component */}
      <WebsiteTour />
      
      {/* Tour Helper Button */}
      <TourHelper />
    </div>
  );
}


