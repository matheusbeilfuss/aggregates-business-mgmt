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

async function handleResponse<T>(response: Response): Promise<T> {
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

    throw new ApiError(
      403,
      errorBody?.message || "Você não tem permissão para acessar este recurso.",
    );
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    const message =
      errorBody?.message || errorBody?.error || "Erro desconhecido";

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export const api = {
  get: <T>(endpoint: string): Promise<T> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    }).then(handleResponse<T>),

  getBlob: async (endpoint: string): Promise<Blob> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Erro ao carregar imagem");
    }

    return response.blob();
  },

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
};
