import { Navigate, Outlet } from "react-router-dom";

import { LoadingState } from "@/components/common/LoadingState";
import { useAuth } from "../hooks/useAuth";

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  

  if (isLoading) {
    return <LoadingState />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
