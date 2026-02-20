import { triggerLogout } from "@/modules/auth/utils/authEvents";

export const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");

  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
}

async function handleError(response: Response) {
  if (response.status === 401) {
    const errorBody = await response.json().catch(() => null);
    triggerLogout();
    throw new ApiError(
      401,
      errorBody?.message || "Sua sessão expirou. Faça login novamente.",
    );
  }

  if (response.status === 403) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiError(403, errorBody?.message || "Você não tem permissão.");
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.message || errorBody?.error || "Erro desconhecido";

    throw new ApiError(response.status, message);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  await handleError(response);

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as T);
}

async function handleBlobResponse(response: Response): Promise<Blob> {
  await handleError(response);
  return response.blob();
}

export const api = {
  get: <T>(endpoint: string): Promise<T> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    }).then(handleResponse<T>),

  getBlob: (endpoint: string): Promise<Blob> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: getAuthHeaders(),
    }).then(handleBlobResponse),

  post: <T>(endpoint: string, data: unknown): Promise<T> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse<T>),

  put: <T>(endpoint: string, data: unknown): Promise<T> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse<T>),

  delete: (endpoint: string): Promise<void> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(handleResponse<void>),

  patch: <T>(endpoint: string, data: unknown): Promise<T> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse<T>),

  putMultipart: <T>(endpoint: string, formData: FormData): Promise<T> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: formData,
    }).then(handleResponse<T>),

  postMultipart: <T>(endpoint: string, formData: FormData): Promise<T> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }).then(handleResponse<T>),
};
