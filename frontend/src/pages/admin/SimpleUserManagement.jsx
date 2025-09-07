// src/pages/admin/SimpleUserManagement.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  X
} from "lucide-react";

export default function SimpleUserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Simple user statistics
  const userStats = [
    {
      title: "Total Users",
      value: 1247,
      change: "+15%",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      color: "blue"
    },
    {
      title: "Active Users",
      value: 1089,
      change: "+12%",
      icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
      color: "green"
    },
    {
      title: "Admins",
      value: 23,
      change: "+2",
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      color: "purple"
    },
    {
      title: "Suspended",
      value: 15,
      change: "-3",
      icon: <AlertCircle className="w-8 h-8 text-red-600" />,
      color: "red"
    }
  ];

  // Simulated API call
  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          name: "Ravi Kumar",
          email: "ravi.kumar@example.com",
          role: "Student",
          status: "Active",
          joinDate: "2024-01-15",
          lastActive: "2024-01-15 10:30:00",
          location: "Mumbai, Maharashtra",
          phone: "+91 98765 43210",
          applications: 5
        },
        {
          id: 2,
          name: "Ananya Singh",
          email: "ananya.singh@example.com",
          role: "Admin",
          status: "Active",
          joinDate: "2023-12-01",
          lastActive: "2024-01-15 09:45:00",
          location: "New Delhi",
          phone: "+91 98765 43211",
          applications: 0
        },
        {
          id: 3,
          name: "Amit Sharma",
          email: "amit.sharma@example.com",
          role: "Student",
          status: "Suspended",
          joinDate: "2024-01-10",
          lastActive: "2024-01-14 15:20:00",
          location: "Bangalore, Karnataka",
          phone: "+91 98765 43212",
          applications: 2
        },
        {
          id: 4,
          name: "Priya Das",
          email: "priya.das@example.com",
          role: "Student",
          status: "Active",
          joinDate: "2023-11-20",
          lastActive: "2024-01-15 08:15:00",
          location: "Chennai, Tamil Nadu",
          phone: "+91 98765 43213",
          applications: 3
        },
        {
          id: 5,
          name: "Suresh Patel",
          email: "suresh.patel@example.com",
          role: "Student",
          status: "Active",
          joinDate: "2024-01-05",
          lastActive: "2024-01-15 11:00:00",
          location: "Ahmedabad, Gujarat",
          phone: "+91 98765 43214",
          applications: 1
        }
      ]);
    }, 1000);
  }, []);

  // Filtered users
  const filteredUsers = users.filter((user) => {
    return (
      (roleFilter === "All" || user.role === roleFilter) &&
      (statusFilter === "All" || user.status === statusFilter) &&
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Suspended": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "Pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Suspended": return "bg-red-100 text-red-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin": return "bg-purple-100 text-purple-700";
      case "Student": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleUserAction = (action, userId) => {
    console.log(`${action} user ${userId}`);
    alert(`✅ ${action} action applied to user ${userId}`);
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">User Management</h1>
            <p className="text-indigo-100 text-sm md:text-base lg:text-lg">
              Manage students and administrators
            </p>
          </div>
          <div className="flex lg:hidden">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center bg-indigo-700/30 rounded-lg p-3">
                <div className="text-lg md:text-xl font-bold">{userStats[0].value.toLocaleString()}</div>
                <div className="text-indigo-200 text-xs md:text-sm">Total</div>
              </div>
              <div className="text-center bg-indigo-700/30 rounded-lg p-3">
                <div className="text-lg md:text-xl font-bold">{userStats[1].value.toLocaleString()}</div>
                <div className="text-indigo-200 text-xs md:text-sm">Active</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats[0].value.toLocaleString()}</div>
                <div className="text-indigo-200 text-sm">Total Users</div>
              </div>
              <div className="w-px h-12 bg-indigo-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats[1].value.toLocaleString()}</div>
                <div className="text-indigo-200 text-sm">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {userStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs lg:text-sm font-medium">{stat.title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{stat.value.toLocaleString()}</p>
                <p className="text-green-600 text-xs lg:text-sm mt-1 flex items-center gap-1">
                  <span className="hidden sm:inline">{stat.change} from last month</span>
                  <span className="sm:hidden">{stat.change}</span>
                </p>
              </div>
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'purple' ? 'bg-purple-100' :
                'bg-red-100'
              }`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Search & Filter Users</h3>
            <p className="text-gray-500 text-xs md:text-sm">Find and manage specific users</p>
          </div>
          <Filter className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          
          <div className="flex">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Add New User</span>
              <span className="sm:hidden">Add User</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-4 md:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800">User List</h3>
              <p className="text-gray-500 text-xs md:text-sm">Manage user accounts and permissions</p>
            </div>
            <div className="text-xs md:text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
        
        {/* Mobile Card View */}
        <div className="block md:hidden">
          <div className="p-4 space-y-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openUserModal(user)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUserAction('edit', user.id)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-full font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)}
                    {user.status}
                  </span>
                  <span className="text-gray-500">
                    {user.applications} applications
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  📍 {user.location}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Applications</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-800">{user.applications}</span>
                      {user.applications > 0 && (
                        <span className="text-xs text-green-600 bg-green-100 px-1 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openUserModal(user)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUserAction('edit', user.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUserAction('suspend', user.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                        title="Suspend User"
                      >
                        <ShieldX className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUserModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedUser.name}</h4>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                      {getStatusIcon(selectedUser.status)}
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selectedUser.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Joined: {selectedUser.joinDate}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Applications</h5>
                    <p className="text-gray-600 text-sm">{selectedUser.applications} applications submitted</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Last Active</h5>
                    <p className="text-gray-600 text-sm">{selectedUser.lastActive}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Edit User
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Send Message
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}