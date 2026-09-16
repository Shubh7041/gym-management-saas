import { Outlet } from "react-router-dom";
import { useState } from "react";

import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { useAppStore } from "@/stores/app.store";
import { useTenantContext } from "@/features/tenanats/hooks/useTenantContext";

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarCollapsed = useAppStore(
    (state) => state.sidebarCollapsed,
  );

  const toggleSidebar = useAppStore(
    (state) => state.toggleSidebar,
  );

  const { loading, error } = useTenantContext();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader
            onMenuClick={() => setMobileMenuOpen(true)}
          />

          <main className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              {loading && (
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
                  Loading gym information...
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}