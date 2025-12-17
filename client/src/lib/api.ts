import { getAuthToken } from "./auth";

const API_BASE = "/api";

// Custom fetch with auth headers
async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });
  
  return response;
}

// API helper functions
export const api = {
  // Auth endpoints
  async register(data: { username: string; email: string; password: string; name: string }) {
    const res = await authFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }
    return res.json();
  },

  async login(data: { email: string; password: string }) {
    const res = await authFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }
    return res.json();
  },

  // Portfolio endpoints
  async getMyPortfolio() {
    const res = await authFetch("/portfolio");
    if (!res.ok) {
      if (res.status === 404) return null;
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch portfolio");
    }
    return res.json();
  },

  async updatePortfolio(data: Record<string, unknown>) {
    const res = await authFetch("/portfolio", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update portfolio");
    }
    return res.json();
  },

  async getPublicPortfolio(username: string) {
    const res = await fetch(`${API_BASE}/portfolio/${username}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      const error = await res.json();
      throw new Error(error.message || "Portfolio not found");
    }
    return res.json();
  },

  // Health check
  async healthCheck() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },
};
