import { Brain, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold">Ignite-X</span>
            </div>
            <p className="text-gray-400 mb-4 text-sm sm:text-base leading-relaxed">
              AI-powered internship recommendation engine for the PM Internship Scheme, 
              helping students across India find their perfect career opportunities.
            </p>
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                <span>support@ignite-x.in</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                <span>+91 1800-123-4567</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-white transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors text-sm">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-white transition-colors text-sm">
                  Browse Internships
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Regional Language Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Community Forum
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Accessibility
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Data Protection
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="Subscribe to updates"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} Ignite-X AI Recommendation Engine. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs text-center sm:text-right">
              Designed for the PM Internship Scheme - Bridging opportunities across India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
