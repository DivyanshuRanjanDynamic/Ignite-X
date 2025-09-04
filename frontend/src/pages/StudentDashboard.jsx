import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function StudentDashboard() {
  // Mock data (replace with API calls later)
  const [stats] = useState({
    applications: 3,
    matches: 5,
    profileCompletion: 70,
  });

  const [internships] = useState([
    { id: 1, title: "Web Developer Intern", company: "TechCorp", location: "Remote" },
    { id: 2, title: "Data Analyst Intern", company: "DataX", location: "Bangalore" },
    { id: 3, title: "AI/ML Intern", company: "InnovateAI", location: "Delhi" },
  ]);

  const [notifications] = useState([
    "Your application for Web Developer Intern is under review.",
    "New internship matches are available based on your profile.",
    "Complete your profile to improve recommendations.",
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-700 text-white p-6 hidden md:block">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <ul className="space-y-4">
            <li className="hover:underline cursor-pointer">Profile</li>
            <li className="hover:underline cursor-pointer">Recommended Internships</li>
            <li className="hover:underline cursor-pointer">My Applications</li>
            <li className="hover:underline cursor-pointer">AI Chatbot</li>
            <li className="hover:underline cursor-pointer">Notifications</li>
            <li className="hover:underline cursor-pointer">Settings</li>
            <li className="hover:underline cursor-pointer text-red-300">Logout</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">
            Welcome Back, Student! 👋
          </h1>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold">Applications</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.applications}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold">Matches</h3>
              <p className="text-2xl font-bold text-green-600">{stats.matches}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold">Profile Completion</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${stats.profileCompletion}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">{stats.profileCompletion}% completed</p>
            </div>
          </div>

          {/* Recommended Internships */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Recommended Internships</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {internships.map((intern) => (
                <div
                  key={intern.id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <h3 className="text-lg font-semibold">{intern.title}</h3>
                  <p className="text-sm text-gray-600">{intern.company}</p>
                  <p className="text-sm text-gray-500">{intern.location}</p>
                  <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Notifications</h2>
            <div className="bg-white p-6 rounded-xl shadow-md space-y-3">
              {notifications.map((note, index) => (
                <p key={index} className="text-gray-700">
                  🔔 {note}
                </p>
              ))}
            </div>
          </section>

          {/* AI Chatbot Placeholder */}
          <section>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">AI Mentor</h2>
            <div className="bg-white p-6 rounded-xl shadow-md text-gray-600">
              <p>💬 Chat with your AI Mentor (Coming Soon...)</p>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default StudentDashboard;
