import { API_BASE, getAuthHeaders } from './config';

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Status ${res.status}`);
  }
  return res.json();
}