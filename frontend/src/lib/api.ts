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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => "Erro desconhecido");
    throw new ApiError(response.status, message);
  }
  return response.json();
}

export const api = {
  get: <T>(endpoint: string): Promise<T> =>
    fetch(`${API_URL}${endpoint}`).then(handleResponse<T>),

  post: <T>(endpoint: string, data: unknown): Promise<T> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse<T>),

  put: <T>(endpoint: string, data: unknown): Promise<T> =>
    fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse<T>),

  delete: (endpoint: string): Promise<void> =>
    fetch(`${API_URL}${endpoint}`, { method: "DELETE" }).then(
      handleResponse<void>,
    ),
};
