import { useState } from "react";
import { Outlet } from "react-router-dom";

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
    <div className="flex min-h-screen bg-muted/20">
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
          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {loading && (
              <div className="mb-4 rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                Loading gym information...
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}