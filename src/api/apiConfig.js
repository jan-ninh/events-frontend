// Use a relative path with Vite's /api proxy in local development.
// A deployment must supply its own securely configured reverse proxy.
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
};
