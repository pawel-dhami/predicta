/**
 * API base URL helper.
 *
 * In development, VITE_API_URL is not set so we fall back to '' (empty string),
 * which lets the Vite dev-server proxy forward /api/* to localhost:8000.
 *
 * In production (Render), VITE_API_URL is set to the backend web service URL,
 * e.g. "https://placeiq-backend.onrender.com"
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? '';

/**
 * Thin fetch wrapper that prepends the API base URL.
 *
 * Usage:
 *   import { apiFetch } from '@/lib/api';
 *   const data = await apiFetch('/api/health').then(r => r.json());
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}
