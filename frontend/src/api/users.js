import api from './client';

// Get current user profile
export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

// Update user profile
export async function updateProfile(userId, profileData) {
  const { data } = await api.put(`/users/${userId}/profile`, profileData);
  return data;
}

// Upload profile picture
export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append('profilePicture', file);

  const { data } = await api.post('/users/profile/picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

// Upload resume
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('resume', file);

  const { data } = await api.post('/users/profile/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

// Get user profile by ID
export async function getUserProfile(userId) {
  const { data } = await api.get(`/users/${userId}/profile`);
  return data;
}

// Update user settings
export async function updateUserSettings(settings) {
  const { data } = await api.put('/users/settings', settings);
  return data;
}

// Get user notifications
export async function getUserNotifications(params = {}) {
  const { data } = await api.get('/notifications', { params });
  return data;
}

// Mark notification as read
export async function markNotificationAsRead(notificationId) {
  const { data } = await api.patch(`/notifications/${notificationId}/read`);
  return data;
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  const { data } = await api.patch('/notifications/read-all');
  return data;
}

// Delete notification
export async function deleteNotification(notificationId) {
  const { data } = await api.delete(`/notifications/${notificationId}`);
  return data;
}

// Get user dashboard data
export async function getDashboardData() {
  const { data } = await api.get('/dashboard');
  return data;
}

// Change password
export async function changePassword(passwordData) {
  const { data } = await api.post('/auth/change-password', passwordData);
  return data;
}

// Deactivate account
export async function deactivateAccount(reason = '') {
  const { data } = await api.post('/users/deactivate', { reason });
  return data;
}

// Delete account
export async function deleteAccount(reason = '') {
  const { data } = await api.delete('/users/account', { data: { reason } });
  return data;
}

// Get user statistics (for profile)
export async function getUserStats() {
  const { data } = await api.get('/users/stats');
  return data;
}

// Update user preferences
export async function updateUserPreferences(preferences) {
  const { data } = await api.put('/users/preferences', preferences);
  return data;
}

// Get user activity log
export async function getUserActivity(params = {}) {
  const { data } = await api.get('/users/activity', { params });
  return data;
}
