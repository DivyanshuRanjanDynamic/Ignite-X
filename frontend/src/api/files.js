import api from './client.js';

/**
 * Get user files by category
 * @param {string} category - Optional category filter (resume, certificate, achievement, etc.)
 * @returns {Promise} API response
 */
export async function getUserFiles(category = null) {
  const url = category ? `users/files/${category}` : 'users/files';
  const { data } = await api.get(url);
  return data;
}

/**
 * Delete a user file
 * @param {string} fileId - File ID to delete
 * @returns {Promise} API response
 */
export async function deleteUserFile(fileId) {
  const { data } = await api.delete(`users/files/${fileId}`);
  return data;
}

/**
 * Upload a new file
 * @param {File} file - File to upload
 * @param {string} category - File category (resume, certificate, achievement, etc.)
 * @returns {Promise} API response
 */
export async function uploadFile(file, category) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  
  const { data } = await api.post('users/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}
