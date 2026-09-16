import { Dumbbell, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <Dumbbell className="h-7 w-7" />
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Gym Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your gym, members and memberships
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-1.5 text-sm text-slate-500">
                Sign in to access your gym dashboard.
              </p>
            </div>

            <LoginForm />

            {/* Forgot password */}
            <div className="mt-5 text-center">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Security note */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />

            <span>Secure gym management portal</span>
          </div>

          {/* Footer */}
          <p className="mt-4 text-center text-xs text-slate-400">
            Gym Management SaaS • Pilot Version
          </p>
        </div>
      </div>
    </div>
  );
}