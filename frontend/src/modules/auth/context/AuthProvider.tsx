import { useCallback, useEffect, useState } from "react";
import { LoginPayload } from "../types";
import { loginService } from "../services/login.service";
import { Outlet } from "react-router-dom";
import { User } from "@/modules/user/types";
import { userService } from "@/modules/user/services/user.service";
import { AuthContext } from "./auth.context";
import { api } from "@/lib/api";

export function AuthProvider() {
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
    fetchUser().finally(() => setIsLoading(false));
  }, [fetchUser]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      await loginService.login(payload);
      await fetchUser();
    },
    [fetchUser],
  );

  const clearSession = useCallback(() => {
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout", {});
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    window.addEventListener("auth:logout", clearSession);
    return () => window.removeEventListener("auth:logout", clearSession);
  }, [clearSession]);

  const value = {
    isAuthenticated: user !== null,
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
