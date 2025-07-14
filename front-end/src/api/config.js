export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';
export const getAuthHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});