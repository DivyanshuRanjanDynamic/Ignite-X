// src/pages/student/Notifications.jsx
import { useState } from "react";
import { Bell, CheckCircle, XCircle, Info, AlertTriangle, Clock, Check } from "lucide-react";
import { useStudentTranslation } from "../../hooks/useTranslation";

export default function Notifications() {
  const { t } = useStudentTranslation();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      message: "Your application for Web Developer Intern is under review.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "success",
      message: "You have been shortlisted for Data Analyst Intern 🎉",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      message: "Complete your profile to improve recommendations.",
      time: "3 days ago",
      read: true,
    },
    {
      id: 4,
      type: "error",
      message: "Your application for AI/ML Intern has been rejected.",
      time: "1 week ago",
      read: true,
    },
  ]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />;
      case "error":
        return <XCircle size={20} className="text-red-600" />;
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-600" />;
      case "info":
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((note) => ({ ...note, read: true }))
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800 flex items-center">
          <Bell className="mr-2 text-blue-600" /> {t('notifications.title')}
        </h2>

        {notifications.some((note) => !note.read) && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Check size={16} /> {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
          <p>{t('notifications.noNotifications')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((note) => (
            <div
              key={note.id}
              className={`flex items-start gap-4 p-4 rounded-xl shadow-sm border transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                note.read ? "bg-gray-50 border-gray-200" : "bg-white border-blue-200"
              }`}
            >
              {/* Icon */}
              <div>{getIcon(note.type)}</div>

              {/* Content */}
              <div className="flex-1">
                <p className={`text-sm ${note.read ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                  {note.message}
                </p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Clock size={14} className="mr-1" /> {note.time}
                </p>
              </div>

              {/* Status dot */}
              {!note.read && (
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



