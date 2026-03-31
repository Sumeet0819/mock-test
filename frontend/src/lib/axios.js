import axios from 'axios';

const api = axios.create({ baseURL: 'https://mock-test-5jt0.onrender.com' });

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  // Admin token
  const adminToken = localStorage.getItem('admin_token');
  // User token
  const userAuth = JSON.parse(localStorage.getItem('user_auth') || 'null');

  if (config.url?.startsWith('/admin') && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userAuth?.token) {
    config.headers.Authorization = `Bearer ${userAuth.token}`;
  }
  return config;
});

export default api;
