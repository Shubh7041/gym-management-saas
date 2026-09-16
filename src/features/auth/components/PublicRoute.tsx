import { Navigate, Outlet } from "react-router-dom";

import { LoadingState } from "@/components/common/LoadingState";
import { useAuth } from "../hooks/useAuth";

export function PublicRoute() {
  console.log("🔥 PUBLIC ROUTE IS RENDERING");
  const { isAuthenticated, isLoading } = useAuth();

  console.log("PUBLIC ROUTE RENDER:", {
    isAuthenticated,
    isLoading,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isAuthenticated) {
    console.log("PUBLIC ROUTE → DASHBOARD");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
