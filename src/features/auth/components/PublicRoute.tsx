import { Navigate, Outlet } from "react-router-dom";

import { LoadingState } from "@/components/common/LoadingState";

import { useAuth } from "../hooks/useAuth";

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("PUBLIC ROUTE:", {
    isAuthenticated,
    isLoading,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isAuthenticated) {
    console.log("REDIRECTING TO DASHBOARD");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
