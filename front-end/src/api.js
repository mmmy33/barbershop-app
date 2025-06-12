import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalReq = error.config;
    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken });
        localStorage.setItem('jwt', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('refreshToken', data.refresh_token);
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        originalReq.headers['Authorization'] = `Bearer ${data.access_token}`;
        return api(originalReq);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
