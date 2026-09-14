import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">
          Gym Management
        </h1>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}