const API_URL = import.meta.env.VITE_API_URL || "/api";

export const api = {
  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include"
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "An error occurred");
    return json;
  },
  get: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include"
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "An error occurred");
    return json;
  },
  patch: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include"
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "An error occurred");
    return json;
  },
};
