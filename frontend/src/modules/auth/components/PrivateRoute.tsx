import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { Loader } from "lucide-react";

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
        <p className="mx-2">Carregando...</p>
      </div>
    );
  }

  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
}
