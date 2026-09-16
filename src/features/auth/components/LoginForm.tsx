import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { authService } from "../services/auth.service";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await authService.signIn({
        email,
        password,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Email
        </label>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={isSubmitting}
            className={`${inputClass} pl-10 pr-3.5`}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Password
        </label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            className={`${inputClass} pl-10 pr-11`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            disabled={isSubmitting}
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="h-11 w-full rounded-xl"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}

        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}