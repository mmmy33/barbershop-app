const DEV_PROXY = '/api';
const PROD_BASE = import.meta.env.VITE_API_BASE;

export const API_BASE = import.meta.env.DEV
  ? DEV_PROXY
  : PROD_BASE;

  console.log('DEV=', import.meta.env.DEV, 'API_BASE=', import.meta.env.DEV ? DEV_PROXY : PROD_BASE);

export const getAuthHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});