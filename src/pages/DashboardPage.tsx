import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authService } from "@/features/auth/services/auth.service";

export function DashboardPage() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await authService.signOut();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {user?.email}
        </p>
      </div>

      <Button variant="outline" onClick={handleLogout}>
        Sign out
      </Button>
    </div>
  );
}
