// src/pages/admin/AdminLayout.jsx
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Database, 
  Users, 
  Settings, 
  Building2,
  Activity,
  UserCheck,
  User,
  Menu,
  X,
  LogOut,
  Shield
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AIAgent from "../../components/AIAgent";

const navClass = ({ isActive }) =>
  `flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200
   ${isActive
     ? "bg-indigo-600 text-white shadow-lg scale-105"  
     : "text-white hover:bg-indigo-500 hover:shadow-md hover:scale-105" 
   }`;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Navigation items for easier management
  const navigationItems = [
    {
      to: "overview",
      icon: BarChart3,
      label: "Dashboard",
      fullLabel: "Dashboard Overview"
    },
    {
      to: "internship-data",
      icon: Database,
      label: "Internships",
      fullLabel: "Internship Management"
    },
    {
      to: "user-management",
      icon: Users,
      label: "Users",
      fullLabel: "User Management"
    },
    {
      to: "profile",
      icon: User,
      label: "Profile",
      fullLabel: "Admin Profile"
    }
  ];

  // Additional desktop-only items
  const desktopOnlyItems = [
    {
      to: "settings",
      icon: Settings,
      label: "Settings",
      fullLabel: "System Settings"
    }
  ];

  const allNavigationItems = [...navigationItems, ...desktopOnlyItems];

  const SidebarContent = () => (
    <>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold tracking-wide flex items-center">
          <Building2 className="w-4 h-4 mr-2 sm:mr-3" />
          <span className="hidden sm:inline">Admin Portal</span>
          <span className="sm:hidden">Admin</span>
        </h2>
        <p className="text-indigo-200 text-sm mt-1 sm:mt-2">PM Internship AI</p>
      </div>
      
      <nav className="space-y-1 sm:space-y-2">
        {allNavigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={navClass}
              onClick={closeMobileSidebar}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              <span className="text-sm sm:text-base">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer - Hidden on mobile */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-indigo-600 hidden sm:block">
        <div className="text-center">
          <p className="text-indigo-200 text-sm">PM Internship Scheme</p>
          <p className="text-indigo-300 text-xs">Admin Management Portal</p>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1 relative">
       
     

        

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 lg:w-72 bg-indigo-700 text-white p-4 lg:p-6 shadow-xl">
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
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
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${
                  isActive ? "text-indigo-600" : "text-gray-400"
                }`} />
                <span className={`text-xs font-medium ${
                  isActive ? "text-indigo-600" : "text-gray-500"
                }`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
