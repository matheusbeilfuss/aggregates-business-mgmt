export interface LoginResponse {
  token: string;
}

// Payloads para API

export interface LoginPayload {
  username: string;
  password: string;
}
