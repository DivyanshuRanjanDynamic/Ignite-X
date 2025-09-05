// src/pages/student/Dashboard.jsx
import { User, Briefcase, FileText, Bell, Settings, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const actions = [
    {
      name: "Profile",
      desc: "View and edit your personal details.",
      icon: <User size={30} />,
      path: "profile",
      color: "from-blue-500 to-indigo-600",
    },
    {
      name: "Recommended Internships",
      desc: "See internships matched to your skills.",
      icon: <Briefcase size={30} />,
      path: "recommendation",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "My Applications",
      desc: "Track the status of your applied internships.",
      icon: <FileText size={30} />,
      path: "applications",
      color: "from-purple-500 to-pink-600",
    },
    {
      name: "AI Chatbot",
      desc: "Get instant answers to your career queries.",
      icon: <Bot size={30} />,
      path: "chatbot",
      color: "from-orange-500 to-red-600",
    },
    {
      name: "Notifications",
      desc: "Stay updated with latest alerts.",
      icon: <Bell size={30} />,
      path: "notifications",
      color: "from-yellow-500 to-orange-600",
    },
    {
      name: "Settings",
      desc: "Manage your preferences and account.",
      icon: <Settings size={30} />,
      path: "progress",
      color: "from-gray-600 to-gray-900",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-800">Welcome, Rohan 👋</h2>
      <p className="text-gray-600 mb-10">
        Explore your dashboard and manage your internship journey.
      </p>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, idx) => (
          <div
            key={idx}
            onClick={() => navigate(action.path)}
            className="cursor-pointer bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.03] transition transform duration-300 ease-in-out group"
          >
            {/* Icon */}
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r ${action.color} text-white mb-4 shadow-md group-hover:scale-110 transition`}
            >
              {action.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition">
              {action.name}
            </h3>
            <p className="text-gray-600 text-sm">{action.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

