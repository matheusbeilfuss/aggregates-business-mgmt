import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function AdminRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" /> Loading...
      </div>
    );
  }

  if (!user?.admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
