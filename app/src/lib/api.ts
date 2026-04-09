const API_URL = import.meta.env.VITE_API_URL || "/api";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions<TBody> {
  method?: RequestMethod;
  data?: TBody;
  headers?: HeadersInit;
}

const request = async <TResponse, TBody = undefined>(
  endpoint: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> => {
  const { method = "GET", data, headers } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (res.status === 204) {
    return undefined as TResponse;
  }

  const json = await res.json();
  if (!res.ok) {
    const message: string =
      typeof json === "object" &&
      json !== null &&
      "message" in json
        ? json.message
        : "An error occurred";
    throw new Error(message);
  }

  return json as TResponse;
};

export const api = {
  get: async <TResponse>(endpoint: string) => {
    return request<TResponse>(endpoint, { method: "GET" });
  },
  post: async <TResponse, TBody = undefined>(endpoint: string, data: TBody) => {
    return request<TResponse, TBody>(endpoint, { method: "POST", data });
  },
  put: async <TResponse, TBody = undefined>(endpoint: string, data: TBody) => {
    return request<TResponse, TBody>(endpoint, { method: "PUT", data });
  },
  patch: async <TResponse, TBody = undefined>(endpoint: string, data: TBody) => {
    return request<TResponse, TBody>(endpoint, { method: "PATCH", data });
  },
  delete: async <TResponse = void>(endpoint: string) => {
    return request<TResponse>(endpoint, { method: "DELETE" });
  },
};
