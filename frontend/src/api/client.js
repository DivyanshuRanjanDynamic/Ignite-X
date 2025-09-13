import axios from 'axios';

// Axios instance with base URL from Vite env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true, // include cookies for refresh tokens if needed
  headers: {
    'Accept': 'application/json'
  }
});

// Attach Authorization header if token is present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// Handle 401 by attempting token refresh and retrying the original request
let isRefreshing = false;
let pendingRequests = [];

function onRefreshed(newToken) {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try refresh flow once
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('No refresh token');

          const { data } = await api.post('/api/v1/auth/refresh-token', { refreshToken });
          const newAccess = data?.data?.accessToken || data?.accessToken;
          if (!newAccess) throw new Error('No new access token');

          // Update tokens in localStorage
          localStorage.setItem('accessToken', newAccess);
          if (data?.data?.refreshToken || data?.refreshToken) {
            localStorage.setItem('refreshToken', data?.data?.refreshToken || data?.refreshToken);
          }

          // Update auth header for original request
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;

          // Process pending requests
          onRefreshed(newAccess);

          // Retry original request
          return api(originalRequest);
        } catch (err) {
          // Clear tokens on refresh failure
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          // Dispatch auth state change if available
          if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { isAuthenticated: false } }));
          }
          
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Queue requests while refreshing
        return new Promise(resolve => {
          pendingRequests.push(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;

