// src/pages/admin/AdminProfile.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  Edit, 
  Upload, 
  Camera,
  Shield, 
  Key, 
  Activity,
  Clock,
  Settings,
  Bell,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Calendar,
  Users,
  FileText,
  Database,
  BarChart3,
  Globe,
  Smartphone,
  Monitor,
  LogOut,
  Download,
  Trash2
} from "lucide-react";

export default function AdminProfile() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Admin profile data
  const [profileData, setProfileData] = useState({
    personal: {
      name: "Rajesh Kumar Singh",
      email: "admin@pminternship.gov.in",
      phone: "+91 98765 43210",
      location: "New Delhi, India",
      department: "Ministry of Education",
      designation: "Senior Administrator",
      employeeId: "ADM-2024-001",
      joinDate: "15 Jan 2023",
      reportingManager: "Dr. Priya Sharma",
      clearanceLevel: "Level 3 - Confidential",
      avatar: null
    },
    security: {
      lastLogin: "Today, 09:15 AM",
      loginAttempts: 0,
      twoFactorEnabled: true,
      passwordLastChanged: "30 days ago",
      sessionTimeout: "30 minutes",
      activeDevices: 2,
      ipWhitelisting: true
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        weeklyReports: true,
        securityAlerts: true
      },
      dashboard: {
        defaultView: "overview",
        dataRefreshRate: "5 minutes",
        theme: "light",
        language: "English"
      }
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Recent admin activities
  const recentActivities = [
    {
      id: 1,
      action: "Updated internship listing",
      details: "Modified 'Digital Marketing Intern' requirements",
      timestamp: "2 hours ago",
      type: "edit",
      icon: <Edit className="w-4 h-4" />
    },
    {
      id: 2,
      action: "Approved user registration",
      details: "Approved 15 new student registrations",
      timestamp: "4 hours ago",
      type: "approval",
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      id: 3,
      action: "Generated system report",
      details: "Monthly analytics report for December 2024",
      timestamp: "1 day ago",
      type: "report",
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 4,
      action: "Security settings updated",
      details: "Modified password policy requirements",
      timestamp: "2 days ago",
      type: "security",
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: 5,
      action: "Database maintenance",
      details: "Performed scheduled database optimization",
      timestamp: "3 days ago",
      type: "maintenance",
      icon: <Database className="w-4 h-4" />
    }
  ];

  // System statistics for admin overview
  const adminStats = [
    {
      title: "Total Students",
      value: "12,847",
      change: "+247 this month",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      color: "blue"
    },
    {
      title: "Active Internships",
      value: "1,234",
      change: "+56 this week",
      icon: <Building2 className="w-6 h-6 text-green-500" />,
      color: "green"
    },
    {
      title: "Applications Today",
      value: "89",
      change: "+12 vs yesterday",
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      color: "purple"
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "All systems operational",
      icon: <Activity className="w-6 h-6 text-orange-500" />,
      color: "orange"
    }
  ];

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "activity", label: "Activity Log", icon: Activity },
    { id: "preferences", label: "Preferences", icon: Settings }
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    }, 1500);
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("❌ New passwords don't match!");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert("❌ Password must be at least 8 characters long!");
      return;
    }

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("✅ Password changed successfully!");
    }, 1500);
  };

  const handleInputChange = (category, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handlePreferenceChange = (category, field, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [field]: value
        }
      }
    }));
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "edit": return "text-blue-600 bg-blue-100";
      case "approval": return "text-green-600 bg-green-100";
      case "report": return "text-purple-600 bg-purple-100";
      case "security": return "text-red-600 bg-red-100";
      case "maintenance": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-800 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold">
                {profileData.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <button className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-white text-blue-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{profileData.personal.name}</h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg">{profileData.personal.designation}</p>
              <p className="text-blue-200 text-xs sm:text-sm">{profileData.personal.department}</p>
            </div>
          </div>
          <div className="flex lg:hidden">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center bg-blue-700/30 rounded-lg p-3">
                <div className="text-lg font-bold">{profileData.security.activeDevices}</div>
                <div className="text-blue-200 text-xs">Sessions</div>
              </div>
              <div className="text-center bg-blue-700/30 rounded-lg p-3">
                <div className="text-lg font-bold text-green-300">Online</div>
                <div className="text-blue-200 text-xs">Status</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData.security.activeDevices}</div>
              <div className="text-blue-200 text-sm">Active Sessions</div>
            </div>
            <div className="w-px h-12 bg-blue-400"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">Online</div>
              <div className="text-blue-200 text-sm">Status</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Admin Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {adminStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 text-xs lg:text-sm font-medium">{stat.title}</h3>
            <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-gray-500 text-xs">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-gray-400"}`} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.personal.name}
                      onChange={(e) => handleInputChange("personal", "name", e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.personal.email}
                      onChange={(e) => handleInputChange("personal", "email", e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={profileData.personal.phone}
                      onChange={(e) => handleInputChange("personal", "phone", e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.personal.location}
                      onChange={(e) => handleInputChange("personal", "location", e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.personal.department}
                      onChange={(e) => handleInputChange("personal", "department", e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                  <input
                    type="text"
                    value={profileData.personal.designation}
                    onChange={(e) => handleInputChange("personal", "designation", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                  <input
                    type="text"
                    value={profileData.personal.employeeId}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                  <input
                    type="text"
                    value={profileData.personal.joinDate}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Manager</label>
                  <input
                    type="text"
                    value={profileData.personal.reportingManager}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Security Clearance</label>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">{profileData.personal.clearanceLevel}</span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Security Overview */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Last Login</span>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{profileData.security.lastLogin}</p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Active Devices</span>
                      <Monitor className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{profileData.security.activeDevices} devices</p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Two-Factor Auth</span>
                      <Shield className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      {profileData.security.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Password Age</span>
                      <Key className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{profileData.security.passwordLastChanged}</p>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={isSaving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                    {isSaving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      {profileData.security.twoFactorEnabled ? "Enabled" : "Enable"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">IP Whitelisting</p>
                        <p className="text-sm text-gray-500">Restrict access to specific IP addresses</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {profileData.security.ipWhitelisting ? "Enabled" : "Enable"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-gray-900">Session Timeout</p>
                        <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                      {profileData.security.sessionTimeout}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity Log Tab */}
          {activeTab === "activity" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Export Log
                </button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.action}</h4>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Load More Activities
                </button>
              </div>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Notification Preferences */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange("notifications", "email", !profileData.preferences.notifications.email)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        profileData.preferences.notifications.email ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        profileData.preferences.notifications.email ? "translate-x-7" : "translate-x-1"
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">SMS Alerts</p>
                        <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange("notifications", "sms", !profileData.preferences.notifications.sms)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        profileData.preferences.notifications.sms ? "bg-green-600" : "bg-gray-300"
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        profileData.preferences.notifications.sms ? "translate-x-7" : "translate-x-1"
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-500">Browser push notifications</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange("notifications", "push", !profileData.preferences.notifications.push)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        profileData.preferences.notifications.push ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        profileData.preferences.notifications.push ? "translate-x-7" : "translate-x-1"
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-gray-900">Weekly Reports</p>
                        <p className="text-sm text-gray-500">System performance and activity reports</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange("notifications", "weeklyReports", !profileData.preferences.notifications.weeklyReports)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        profileData.preferences.notifications.weeklyReports ? "bg-orange-600" : "bg-gray-300"
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        profileData.preferences.notifications.weeklyReports ? "translate-x-7" : "translate-x-1"
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900">Security Alerts</p>
                        <p className="text-sm text-gray-500">Important security notifications</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange("notifications", "securityAlerts", !profileData.preferences.notifications.securityAlerts)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        profileData.preferences.notifications.securityAlerts ? "bg-red-600" : "bg-gray-300"
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        profileData.preferences.notifications.securityAlerts ? "translate-x-7" : "translate-x-1"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dashboard Preferences */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Dashboard Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
                    <select
                      value={profileData.preferences.dashboard.defaultView}
                      onChange={(e) => handlePreferenceChange("dashboard", "defaultView", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="overview">Overview</option>
                      <option value="analytics">Analytics</option>
                      <option value="users">User Management</option>
                      <option value="internships">Internship Data</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Refresh Rate</label>
                    <select
                      value={profileData.preferences.dashboard.dataRefreshRate}
                      onChange={(e) => handlePreferenceChange("dashboard", "dataRefreshRate", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1 minute">1 minute</option>
                      <option value="5 minutes">5 minutes</option>
                      <option value="10 minutes">10 minutes</option>
                      <option value="30 minutes">30 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={profileData.preferences.dashboard.theme}
                      onChange={(e) => handlePreferenceChange("dashboard", "theme", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={profileData.preferences.dashboard.language}
                      onChange={(e) => handlePreferenceChange("dashboard", "language", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">हिंदी</option>
                      <option value="Bengali">বাংলা</option>
                      <option value="Telugu">తెలుగు</option>
                      <option value="Marathi">मराठी</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setIsSaving(true);
                      setTimeout(() => {
                        setIsSaving(false);
                        alert("✅ Preferences saved successfully!");
                      }, 1000);
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
