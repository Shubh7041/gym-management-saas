import {
  Activity,
  ArrowRight,
  CreditCard,
  Dumbbell,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authService } from "@/features/auth/services/auth.service";

const stats = [
  {
    label: "Total Members",
    value: "1",
    change: "+1 this month",
    icon: Users,
  },
  {
    label: "Active Members",
    value: "1",
    change: "100% active",
    icon: Activity,
  },
  {
    label: "Active Plans",
    value: "1",
    change: "Currently available",
    icon: Dumbbell,
  },
  {
    label: "Monthly Revenue",
    value: "₹1,500",
    change: "Current subscriptions",
    icon: CreditCard,
  },
];

export function DashboardPage() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await authService.signOut();
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 max-w-full truncate text-sm text-slate-500">
            Welcome back, {user?.email}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full sm:w-fit"
        >
          Sign out
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
                    {stat.label}
                  </p>

                  <p className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-2xl">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>

              <div className="mt-3 flex min-w-0 items-center gap-1.5 text-[11px] text-slate-500 sm:mt-4 sm:text-xs">
                <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-500" />

                <span className="truncate">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Common actions for managing your gym
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2">
            <Link
              to="/dashboard/members/new"
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left transition-colors hover:border-primary/30 hover:bg-primary/5 sm:gap-4 sm:p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserPlus className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Add Member
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  Register a new gym member
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/dashboard/subscriptions/new"
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left transition-colors hover:border-primary/30 hover:bg-primary/5 sm:gap-4 sm:p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  New Subscription
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  Start a membership
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/dashboard/members"
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left transition-colors hover:border-primary/30 hover:bg-primary/5 sm:gap-4 sm:p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  View Members
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  Manage all gym members
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/dashboard/membership-plans"
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left transition-colors hover:border-primary/30 hover:bg-primary/5 sm:gap-4 sm:p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Dumbbell className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Membership Plans
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  Manage your gym plans
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              System Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current application status
            </p>
          </div>

          <div className="mt-4 space-y-3 sm:mt-5">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />

                <span className="truncate text-sm font-medium text-slate-700">
                  Authentication
                </span>
              </div>

              <span className="shrink-0 text-xs font-medium text-emerald-600">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />

                <span className="truncate text-sm font-medium text-slate-700">
                  Database
                </span>
              </div>

              <span className="shrink-0 text-xs font-medium text-emerald-600">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />

                <span className="truncate text-sm font-medium text-slate-700">
                  Security
                </span>
              </div>

              <span className="shrink-0 text-xs font-medium text-emerald-600">
                Protected
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:mt-5">
            <p className="text-xs font-semibold text-primary">
              Pilot Version
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Core gym management features are being built incrementally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}