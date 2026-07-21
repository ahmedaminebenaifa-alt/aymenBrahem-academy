import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

// Access token lives in memory only — never localStorage, never sessionStorage.
// This is intentional: it's the one piece of the security model that makes the
// httpOnly refresh cookie meaningful. If the access token were in localStorage,
// an XSS bug would leak it directly; keeping it in memory means a page reload
// clears it, and it can only be re-obtained via the httpOnly cookie + /refresh.
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required to send/receive the httpOnly refresh cookie
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ── Silent refresh queueing ──
// If multiple requests fail with 401 at the same time (e.g. a page fires 4 requests
// on mount and the access token just expired), we don't want 4 separate refresh calls
// racing each other. Only the first 401 triggers a refresh; the rest wait for it.
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeToRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh on the refresh endpoint itself, or on login/register —
    // a 401 there means real invalid credentials, not an expired access token.
    if (
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // Another request already triggered a refresh — wait for it instead of firing our own
      return new Promise((resolve) => {
        subscribeToRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      setAccessToken(data.accessToken);
      onRefreshed(data.accessToken);
      isRefreshing = false;

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      refreshSubscribers = [];
      setAccessToken(null);

      // Refresh truly failed — the session is dead. Let AuthContext handle the redirect,
      // not a hard window.location.href here, so React state stays consistent.
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      return Promise.reject(refreshError);
    }
  }
);

export default api;