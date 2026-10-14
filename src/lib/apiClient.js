import axios from 'axios';
import { supabase } from './supabaseClient';

/**
 * SMILE FOOD — Authenticated API Client
 * Implements silent token refresh on 401 responses per Section 7.B of the master prompt.
 */

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
  withCredentials: true, // for httpOnly refresh token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach Bearer Token ────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Silent Token Refresh on 401 ───────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once to avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt silent token refresh via Supabase
        const { data, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !data.session) {
          throw refreshError || new Error('No session after refresh');
        }

        // Update the Authorization header with the new token
        originalRequest.headers['Authorization'] = `Bearer ${data.session.access_token}`;

        // Replay the original failed request
        return apiClient(originalRequest);
      } catch (refreshFailed) {
        // Preserve application state before redirecting to login
        const currentPath = window.location.pathname + window.location.search;
        
        // Save current cart state (from localStorage if it exists)
        const cartState = localStorage.getItem('smilefood_cart') || '{}';
        
        sessionStorage.setItem(
          'saved_state',
          JSON.stringify({
            cart: JSON.parse(cartState),
            returnUrl: currentPath,
          })
        );

        // Sign out and redirect to login
        await supabase.auth.signOut();
        window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
        
        return Promise.reject(refreshFailed);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
