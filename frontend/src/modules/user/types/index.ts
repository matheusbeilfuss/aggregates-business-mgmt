export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  imgName?: string;
  admin: boolean;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface CreateUserPayload extends UpdateUserPayload {
  password: string;
  admin: boolean;
}
