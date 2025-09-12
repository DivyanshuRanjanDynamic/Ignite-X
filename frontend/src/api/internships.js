import api from './client';

// Get all internships with filters and pagination
export async function getInternships(params = {}) {
  const { data } = await api.get('/internships', { params });
  return data;
}

// Get single internship by ID
export async function getInternshipById(id) {
  const { data } = await api.get(`/internships/${id}`);
  return data;
}

// Apply to an internship
export async function applyToInternship(internshipId, applicationData) {
  const formData = new FormData();
  
  // Add basic application data
  Object.entries(applicationData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'resume' && value instanceof File) {
        formData.append('resume', value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  const { data } = await api.post(`/internships/${internshipId}/apply`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

// Get student's applications
export async function getMyApplications(params = {}) {
  const { data } = await api.get('/applications/my-applications', { params });
  return data;
}

// Get single application by ID
export async function getApplicationById(id) {
  const { data } = await api.get(`/applications/${id}`);
  return data;
}

// Update application status (for students to withdraw)
export async function updateApplicationStatus(id, status) {
  const { data } = await api.patch(`/applications/${id}/status`, { status });
  return data;
}

// Get internship recommendations for student
export async function getRecommendations(filters = {}) {
  const params = {};
  
  // Add filter parameters if provided
  if (filters.location) params.location = filters.location;
  if (filters.skills && filters.skills.length > 0) params.skills = filters.skills.join(',');
  if (filters.domain) params.domain = filters.domain;
  if (filters.educationLevel) params.educationLevel = filters.educationLevel;
  if (filters.minAmount) params.minAmount = filters.minAmount;
  if (filters.maxAmount) params.maxAmount = filters.maxAmount;
  if (filters.workPreference) params.workPreference = filters.workPreference;
  if (filters.duration) params.duration = filters.duration;
  
  const { data } = await api.get('/internships/recommendations', { params });
  return data;
}

// Search internships
export async function searchInternships(query, filters = {}) {
  const params = { q: query, ...filters };
  const { data } = await api.get('/internships/search', { params });
  return data;
}

// Get internship categories/types
export async function getInternshipCategories() {
  const { data } = await api.get('/internships/categories');
  return data;
}

// Get internship statistics
export async function getInternshipStats() {
  const { data } = await api.get('/internships/stats');
  return data;
}

// Save/bookmark an internship
export async function saveInternship(internshipId) {
  const { data } = await api.post(`/internships/${internshipId}/save`);
  return data;
}

// Unsave/unbookmark an internship
export async function unsaveInternship(internshipId) {
  const { data } = await api.delete(`/internships/${internshipId}/save`);
  return data;
}

// Get saved internships
export async function getSavedInternships() {
  const { data } = await api.get('/internships/saved');
  return data;
}

// Get internship skills requirement
export async function getInternshipSkills(internshipId) {
  const { data } = await api.get(`/internships/${internshipId}/skills`);
  return data;
}

// Create new internship (admin only)
export async function createInternship(internshipData) {
  const { data } = await api.post('/internships', internshipData);
  return data;
}

// Update internship (admin only)
export async function updateInternship(id, internshipData) {
  const { data } = await api.put(`/internships/${id}`, internshipData);
  return data;
}

// Delete internship (admin only)
export async function deleteInternship(id) {
  const { data } = await api.delete(`/internships/${id}`);
  return data;
}

// Get internship applications (admin only)
export async function getInternshipApplications(internshipId, params = {}) {
  const { data } = await api.get(`/internships/${internshipId}/applications`, { params });
  return data;
}
