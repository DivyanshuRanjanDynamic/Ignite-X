// src/pages/student/Profile.jsx
import { useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit,
  Upload,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";

export default function Profile() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const user = {
    name: "Rohan Kumar",
    email: "rohansrajput1410@gmail.com",
    phone: "+91 98765 43210",
    location: "Kolkata, India",
    college: "MAKAUT University",
    course: "B.Tech in AI & ML",
    year: "3rd Year",
    skills: ["React", "Node.js", "Python", "Machine Learning"],
    resume: null, // ✅ Will store uploaded resume later
    github: "https://github.com/RohanKumar1410",
   linkedin: "https://www.linkedin.com/in/rohan-kumar-2678a52b2",
    portfolio: "https://coderhu-rgb.github.io",
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-800">👤 My Profile</h2>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 relative hover:shadow-2xl hover:scale-[1.02] transition duration-300 ease-in-out">
        {/* Edit button */}
        <button className="absolute top-3 right-3 sm:top-4 sm:right-4 text-blue-600 hover:text-blue-800 hover:scale-110 transition">
          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* User Header */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg hover:scale-110 transition duration-300 flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{user.name}</h3>
            <p className="text-sm sm:text-base text-gray-600 truncate">{user.course}</p>
            <span className="inline-block mt-1 text-xs sm:text-sm bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-full shadow-sm hover:scale-105 transition">
              {user.year}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center text-gray-700 hover:scale-105 transition">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
            <span className="text-sm sm:text-base truncate">{user.email}</span>
          </div>
          <div className="flex items-center text-gray-700 hover:scale-105 transition">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 flex-shrink-0" />
            <span className="text-sm sm:text-base">{user.phone}</span>
          </div>
          <div className="flex items-center text-gray-700 hover:scale-105 transition">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600 flex-shrink-0" />
            <span className="text-sm sm:text-base truncate">{user.location}</span>
          </div>
          <div className="flex items-center text-gray-700 hover:scale-105 transition">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600 flex-shrink-0" />
            <span className="text-sm sm:text-base truncate">{user.college}</span>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-4 sm:mt-6">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900">💡 Skills</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 sm:px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium shadow-sm hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Resume Upload */}
        <div className="mt-4 sm:mt-6">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900">📄 Resume</h4>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button className="flex items-center justify-center sm:justify-start px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition duration-300">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Upload Resume</span>
            </button>
            {user.resume ? (
              <span className="text-green-600 font-medium animate-pulse text-sm sm:text-base text-center sm:text-left">
                Uploaded ✅
              </span>
            ) : (
              <span className="text-gray-500 text-sm sm:text-base text-center sm:text-left">No resume uploaded</span>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-4 sm:mt-6">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900">🌐 Social Links</h4>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center sm:justify-start px-3 py-2 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800 hover:shadow-lg hover:scale-110 transition"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">GitHub</span>
            </a>
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center sm:justify-start px-3 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 hover:shadow-lg hover:scale-110 transition"
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">LinkedIn</span>
            </a>
            <a
              href={user.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center sm:justify-start px-3 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:shadow-lg hover:scale-110 transition"
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}




