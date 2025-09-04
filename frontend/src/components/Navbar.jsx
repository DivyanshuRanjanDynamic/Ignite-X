import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h1 className="text-2xl font-bold">Ignite-X</h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="flex items-center gap-1 hover:text-gray-200"
              >
                Features <ChevronDown size={18} />
              </button>
              {featuresOpen && (
                <div className="absolute mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg">
                  <Link
                    to="#smart-matching"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Smart Matching
                  </Link>
                  <Link
                    to="#equal-access"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Equal Access
                  </Link>
                  <Link
                    to="#skill-growth"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Skill Growth
                  </Link>
                </div>
              )}
            </div>

            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLoginOpen(!loginOpen)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100"
              >
                Login
              </button>
              {loginOpen && (
                <div className="absolute mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg">
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/admin-login"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Admin Login
                  </Link>
                </div>
              )}
            </div>

            {/* Register Button */}
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-700"
            >
              Register
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 text-white px-4 pb-4 space-y-3">
          {/* Features dropdown in mobile */}
          <div>
            <button
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className="flex items-center gap-1 w-full py-2"
            >
              Features <ChevronDown size={18} />
            </button>
            {featuresOpen && (
              <div className="ml-4 space-y-1">
                <Link to="#smart-matching" className="block py-1">
                  Smart Matching
                </Link>
                <Link to="#equal-access" className="block py-1">
                  Equal Access
                </Link>
                <Link to="#skill-growth" className="block py-1">
                  Skill Growth
                </Link>
              </div>
            )}
          </div>

          {/* Login dropdown in mobile */}
          <div>
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg"
            >
              Login
            </button>
            {loginOpen && (
              <div className="ml-4 space-y-1 bg-white text-gray-800 rounded-lg mt-2">
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
                  Student Login
                </Link>
                <Link
                  to="/admin-login"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>

          {/* Register */}
          <Link
            to="/register"
            className="block px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
