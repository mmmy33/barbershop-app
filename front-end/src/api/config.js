export const API_BASE = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_BASE;

  // console.log('DEV=', import.meta.env.DEV, 'API_BASE=', API_BASE);

export const getAuthHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});