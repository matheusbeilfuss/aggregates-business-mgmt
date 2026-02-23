import { createContext, useCallback, useEffect, useState } from "react";
import { LoginPayload } from "../types";
import { loginService } from "../services/login.service";
import { Outlet } from "react-router-dom";
import { setLogoutListener } from "../utils/authEvents";
import { api } from "@/lib/api";
import { User } from "@/modules/user/types";
import { userService } from "@/modules/user/services/user.service";
import { settingsService } from "@/modules/settings/services/settings.service";

export interface AuthContextData {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  refetchUser: () => Promise<void>;
  businessName?: string;
  refetchSettings: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function AuthProvider() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [businessName, setBusinessName] = useState<string | undefined>(
    "Nome do Comércio",
  );

  const fetchUser = useCallback(async () => {
    try {
      const me = await userService.getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const settings = await settingsService.get();
      setBusinessName(settings.businessName);
    } catch {
      setBusinessName("Nome do Comércio");
    }
  }, []);

  useEffect(() => {
    async function validateToken() {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        await api.get("/users/me");
        setToken(storedToken);
        await fetchUser();
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    validateToken();
  }, [fetchUser]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginService.login(payload);

      localStorage.setItem("token", response.token);
      setToken(response.token);

      await fetchUser();
    },
    [fetchUser],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  useEffect(() => {
    setLogoutListener(logout);
  }, [logout]);

  const value = {
    token,
    isAuthenticated: !!token,
    isLoading,
    user,
    refetchUser: fetchUser,
    businessName,
    refetchSettings: fetchSettings,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
}
