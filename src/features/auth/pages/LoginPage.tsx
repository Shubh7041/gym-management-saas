import { Link } from "react-router-dom";

import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Gym Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your gym
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Welcome back
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter your credentials to continue.
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}