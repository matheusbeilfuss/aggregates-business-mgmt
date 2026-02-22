import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/modules/user/hooks/useUsers";
import { Loader } from "lucide-react";

export function AdminRoute() {
  const { data: user, loading } = useUser();

  if (loading) {
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
