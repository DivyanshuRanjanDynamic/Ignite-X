// src/pages/student/Profile.jsx
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
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">👤 My Profile</h2>

      <div className="bg-white rounded-2xl shadow-xl p-6 relative hover:shadow-2xl hover:scale-[1.02] transition duration-300 ease-in-out">
        {/* Edit button */}
        <button className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 hover:scale-110 transition">
          <Edit size={20} />
        </button>

        {/* User Header */}
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg hover:scale-110 transition duration-300">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
            <p className="text-gray-600">{user.course}</p>
            <span className="inline-block mt-1 text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full shadow-sm hover:scale-105 transition">
              {user.year}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700 hover:scale-105 transition">
            <Mail size={18} className="mr-2 text-blue-600" /> {user.email}
          </div>
          <div className="flex items-center text-gray-700 hover:scale-105 transition">
            <Phone size={18} className="mr-2 text-green-600" /> {user.phone}
          </div>
          <div className="flex items-center text-gray-700 hover:scale-105 transition">
            <MapPin size={18} className="mr-2 text-red-600" /> {user.location}
          </div>
          <div className="flex items-center text-gray-700 hover:scale-105 transition">
            <Briefcase size={18} className="mr-2 text-purple-600" />{" "}
            {user.college}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900">💡 Skills</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium shadow-sm hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Resume Upload */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900">📄 Resume</h4>
          <div className="mt-3 flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition duration-300">
              <Upload size={18} className="mr-2" /> Upload Resume
            </button>
            {user.resume ? (
              <span className="text-green-600 font-medium animate-pulse">
                Uploaded ✅
              </span>
            ) : (
              <span className="text-gray-500">No resume uploaded</span>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900">🌐 Social Links</h4>
          <div className="flex items-center space-x-4 mt-3">
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800 hover:shadow-lg hover:scale-110 transition"
            >
              <Github size={18} className="mr-2" /> GitHub
            </a>
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 hover:shadow-lg hover:scale-110 transition"
            >
              <Linkedin size={18} className="mr-2" /> LinkedIn
            </a>
            <a
              href={user.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:shadow-lg hover:scale-110 transition"
            >
              <Globe size={18} className="mr-2" /> Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}




