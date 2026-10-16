import axios from 'axios';
import { supabase } from './supabaseClient';
import { sanitizeErrorResponse } from './apiSecurity';

/**
 * SMILE FOOD — Authenticated API Client
 * Implements silent token refresh on 401 responses and error sanitization.
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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch {
      // Non-blocking in demo mode
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Silent Token Refresh on 401 & Error Sanitization ──
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once on 401 to avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !data.session) {
          throw refreshError || new Error('No session after refresh');
        }

        originalRequest.headers['Authorization'] = `Bearer ${data.session.access_token}`;
        return apiClient(originalRequest);
      } catch (refreshFailed) {
        const currentPath = window.location.pathname + window.location.search;
        const cartState = localStorage.getItem('smilefood_cart') || '[]';
        
        sessionStorage.setItem(
          'saved_state',
          JSON.stringify({
            cart: JSON.parse(cartState),
            returnUrl: currentPath,
          })
        );

        await supabase.auth.signOut();
        window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
        return Promise.reject(new Error(sanitizeErrorResponse(refreshFailed)));
      }
    }

    // Sanitize any server/database error disclosures
    if (error.response?.data?.message) {
      error.response.data.message = sanitizeErrorResponse(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
