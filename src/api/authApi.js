import { apiConfig } from "./apiConfig";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Authentication request failed");
  }
  return data;
}

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${apiConfig.baseUrl}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await parseResponse(response);
  return { token: data.accessToken, user: data.participant };
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${apiConfig.baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseResponse(response);
  return { token: data.accessToken, user: data.participant };
}

export async function fetchProfile(token) {
  const response = await fetch(`${apiConfig.baseUrl}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseResponse(response);
}
