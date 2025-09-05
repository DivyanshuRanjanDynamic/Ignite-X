// src/pages/student/StudentSettings.jsx
import { useState } from "react";
import { User, Lock, Bell, Globe, Save } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  const [settings, setSettings] = useState({
    name: "Rohan Kumar",
    email: "rohansrajput1410@gmail.com",
    language: "English",
    notifications: true,
    darkMode: false,
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    alert("✅ Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
        ⚙️ Settings
      </h2>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 border-b pb-3 mb-8">
        {[
          { key: "account", label: "Account" },
          { key: "preferences", label: "Preferences" },
          { key: "notifications", label: "Notifications" },
          { key: "security", label: "Security" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-t-lg font-medium transition transform ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "text-gray-600 hover:text-blue-600 hover:scale-105"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.01] transition duration-300">
        {activeTab === "account" && (
          <div>
            <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-6">
              <User className="mr-2 text-blue-600" /> Account Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-300 shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div>
            <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-6">
              <Globe className="mr-2 text-green-600" /> Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Language
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-green-300 shadow-sm"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Bengali</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 mt-6 md:mt-0">
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600"
                />
                <label className="text-sm text-gray-700 font-medium">
                  Enable Dark Mode
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-6">
              <Bell className="mr-2 text-yellow-600" /> Notifications
            </h3>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600"
              />
              <label className="text-sm text-gray-700 font-medium">
                Enable Email Notifications
              </label>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-6">
              <Lock className="mr-2 text-red-600" /> Security
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={settings.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-red-300 shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition transform"
        >
          <Save size={18} className="mr-2" /> Save Changes
        </button>
      </div>
    </div>
  );
}



