import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoadingScreen() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-9 h-9 rounded-full animate-spin"
          style={{
            border: "3px solid var(--color-primary-90)",
            borderTopColor: "var(--color-primary-40)",
          }}
        />
        <span
          className="text-sm"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Carregando...
        </span>
      </div>
    </div>
  );
}

export function AdminRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!user?.admin) return <Navigate to="/" replace />;
  return <Outlet />;
}
