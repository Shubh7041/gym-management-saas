import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Edit,
  Eye,
  Plus,
  Power,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { membershipPlansService } from "../services/membership-plans.service";
import type { MembershipPlan } from "../types/membership-plan.types";

export default function MembershipPlansPage() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        setError(null);

        const data = await membershipPlansService.getPlans();

        setPlans(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load membership plans.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  async function handleToggleStatus(plan: MembershipPlan) {
    const nextStatus =
      plan.status === "active" ? "inactive" : "active";

    const confirmed = window.confirm(
      nextStatus === "inactive"
        ? `Deactivate "${plan.name}"? It will no longer be available for new memberships.`
        : `Activate "${plan.name}"? It will become available for new memberships.`,
    );

    if (!confirmed) return;

    try {
      await membershipPlansService.updatePlan(plan.id, {
        status: nextStatus,
      });

      setPlans((currentPlans) =>
        currentPlans.map((currentPlan) =>
          currentPlan.id === plan.id
            ? { ...currentPlan, status: nextStatus }
            : currentPlan,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update membership plan status.",
      );
    }
  }

  const activePlans = plans.filter(
    (plan) => plan.status === "active",
  ).length;

  const inactivePlans = plans.length - activePlans;

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Membership Plans
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage the membership plans offered by your gym.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/membership-plans/new")
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Plan
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Summary Cards                                                       */}
      {/* ------------------------------------------------------------------ */}

      {!loading && !error && plans.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={Sparkles}
            label="Total Plans"
            value={plans.length}
          />

          <SummaryCard
            icon={CheckCircle2}
            label="Active Plans"
            value={activePlans}
          />

          <SummaryCard
            icon={Clock3}
            label="Inactive Plans"
            value={inactivePlans}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Loading                                                             */}
      {/* ------------------------------------------------------------------ */}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />

            <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />

            <div className="space-y-3 pt-3">
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Error                                                               */}
      {/* ------------------------------------------------------------------ */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Power className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-red-800">
                Unable to load membership plans
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Empty State                                                         */}
      {/* ------------------------------------------------------------------ */}

      {!loading && !error && plans.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-base font-semibold text-slate-900">
            No membership plans yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Create your first membership plan to start assigning
            memberships to gym members.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/membership-plans/new")
            }
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Create First Plan
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Plans Table                                                         */}
      {/* ------------------------------------------------------------------ */}

      {!loading && !error && plans.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                All Membership Plans
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {plans.length}{" "}
                {plans.length === 1 ? "plan" : "plans"} configured
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr className="text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Plan
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Duration
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {plans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    {/* Plan */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Sparkles className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/dashboard/membership-plans/${plan.id}`,
                              )
                            }
                            className="max-w-[260px] truncate text-left font-semibold text-slate-900 transition-colors hover:text-primary"
                          >
                            {plan.name}
                          </button>

                          {plan.description && (
                            <p className="mt-0.5 max-w-[320px] truncate text-xs text-slate-500">
                              {plan.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4">
                      <span className="font-medium text-slate-700">
                        {plan.duration_days}
                      </span>{" "}
                      <span className="text-slate-500">
                        {plan.duration_days === 1
                          ? "day"
                          : "days"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-900">
                        ₹
                        {Number(plan.price).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <PlanStatusBadge status={plan.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <ActionButton
                          icon={Eye}
                          label="View"
                          onClick={() =>
                            navigate(
                              `/dashboard/membership-plans/${plan.id}`,
                            )
                          }
                        />

                        <ActionButton
                          icon={Edit}
                          label="Edit"
                          onClick={() =>
                            navigate(
                              `/dashboard/membership-plans/${plan.id}/edit`,
                            )
                          }
                        />

                        <ActionButton
                          icon={Power}
                          label={
                            plan.status === "active"
                              ? "Deactivate"
                              : "Activate"
                          }
                          onClick={() =>
                            void handleToggleStatus(plan)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary Card                                                               */
/* -------------------------------------------------------------------------- */

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function PlanStatusBadge({
  status,
}: {
  status: MembershipPlan["status"];
}) {
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
          : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />

      {capitalize(status)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Action Button                                                              */
/* -------------------------------------------------------------------------- */

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}