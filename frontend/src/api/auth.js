import api from './client';

export async function login({ email, password, userType = 'student', remember = false }) {
  const { data } = await api.post('/auth/login', { email, password, userType, remember });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function registerStudent(form) {
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    // Serialize skills and interests as repeated fields for maximum backend compatibility
    if (key === 'skills' || key === 'interests') {
      let arr = [];
      if (Array.isArray(value)) {
        arr = value;
      } else if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) arr = parsed;
        } catch (e) {
          const sanitized = value.trim().replace(/^\[|\]$/g, '');
          arr = sanitized.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
        }
      }
      arr.forEach(v => formData.append(`${key}[]`, v));
      return;
    }

    // Ensure nested objects are serialized properly in multipart/form-data
    if (key === 'botProtection' && typeof value === 'object') {
      try {
        const serialized = JSON.stringify(value);
        formData.append('botProtection', serialized);
        // Also expose captchaToken at top-level for backend convenience/fallback parsing
        if (value.captchaToken) {
          formData.append('captchaToken', value.captchaToken);
        }
      } catch (e) {
        // If serialization fails, skip to avoid sending "[object Object]"
      }
      return;
    }

    formData.append(key, value);
  });
  const { data } = await api.post('/auth/register/student', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

// ADMIN REGISTRATION DISABLED - Only pre-seeded admins allowed
export async function registerAdmin(payload) {
  // Throw error immediately - admin registration is not allowed
  throw new Error('Admin registration is permanently disabled. Only pre-authorized system administrators can access admin features.');
}

export async function verifyEmail(token) {
  const { data } = await api.post('/auth/verify-email', { token });
  return data;
}

export async function resendVerification(email) {
  const { data } = await api.post('/auth/resend-verification', { email });
  return data;
}

export async function forgotPassword(email) {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword({ token, password, confirmPassword }) {
  const { data } = await api.post('/auth/reset-password', { token, password, confirmPassword });
  return data;
}

export async function logout() {
  const { data } = await api.post('/auth/logout');
  return data;
}

