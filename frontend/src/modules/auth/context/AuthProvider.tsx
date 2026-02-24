import { useCallback, useEffect, useState } from "react";
import { LoginPayload } from "../types";
import { loginService } from "../services/login.service";
import { Outlet } from "react-router-dom";
import { User } from "@/modules/user/types";
import { userService } from "@/modules/user/services/user.service";
import { AuthContext } from "./auth.context";

export function AuthProvider() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const me = await userService.getMe();
      setUser(me);
    } catch {
      setUser(null);
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
        const me = await userService.getMe();
        setToken(storedToken);
        setUser(me);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    validateToken();
  }, []);

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
    setUser(null);
  }, []);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, [logout]);

  const value = {
    token,
    isAuthenticated: !!token,
    isLoading,
    user,
    refetchUser: fetchUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
}
