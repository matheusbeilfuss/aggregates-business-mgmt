import { createContext, useEffect, useMemo, useState } from "react";
import { LoginPayload } from "../types";
import { loginService } from "../services/login.service";
import { Outlet, useNavigate } from "react-router-dom";
import { setLogoutListener } from "../utils/authEvents";

export interface AuthContextData {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function AuthProvider() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (payload: LoginPayload) => {
    const response = await loginService.login(payload);

    localStorage.setItem("token", response.token);
    setToken(response.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  useEffect(() => {
    setLogoutListener(logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
    }),
    [token, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
}
