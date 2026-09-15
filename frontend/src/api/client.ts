const BASE_URL = "http://127.0.0.1:8000";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("access_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const detail = errorBody.detail;
    const message = Array.isArray(detail)
        ? detail.map((d: { msg: string }) => d.msg).join(", ")
        : detail || `Request failed with status ${response.status}`;
    throw new Error(message);
    }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}