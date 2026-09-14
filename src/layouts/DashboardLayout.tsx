import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/layout/AppSidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}