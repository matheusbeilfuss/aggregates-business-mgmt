import { createContext } from "react";
import { User } from "@/modules/user/types";
import { LoginPayload } from "../types";

export interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  refetchUser: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);
