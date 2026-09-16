import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit,
  IndianRupee,
  Sparkles,
} from "lucide-react";

import { membershipPlansService } from "../services/membership-plans.service";
import type { MembershipPlan } from "../types/membership-plan.types";

export default function MembershipPlanDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlan() {
      if (!id) {
        setError("Membership plan ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await membershipPlansService.getPlanById(id);

        setPlan(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load membership plan.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPlan();
  }, [id]);

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-11 w-64 animate-pulse rounded-xl bg-slate-100" />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />

            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  if (error || !plan) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/membership-plans")
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Plans
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-red-800">
            Unable to load membership plan
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error ?? "Membership plan not found."}
          </p>
        </div>
      </div>
    );
  }

  const isActive = plan.status === "active";

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/membership-plans")
            }
            className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            aria-label="Back to membership plans"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex min-w-0 items-start gap-3">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900">
                  {plan.name}
                </h1>

                <PlanStatusBadge status={plan.status} />
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Membership plan details and configuration.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/dashboard/membership-plans/${plan.id}/edit`,
            )
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
        >
          <Edit className="h-4 w-4" />
          Edit Plan
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main Overview                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pricing / Duration */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Plan Overview
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {plan.name}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Price */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <IndianRupee className="h-4 w-4" />
                Price
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                ₹{Number(plan.price).toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Per membership period
              </p>
            </div>

            {/* Duration */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock3 className="h-4 w-4" />
                Duration
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {plan.duration_days}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {plan.duration_days === 1 ? "day" : "days"}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Current Status
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                {isActive ? "Active" : "Inactive"}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {isActive
                  ? "Available for new memberships"
                  : "Not available for new memberships"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-xs leading-5 text-slate-500">
              {isActive
                ? "Members can currently be enrolled in this plan."
                : "Existing memberships remain valid, but this plan cannot be selected for new memberships."}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Description                                                          */}
      {/* ------------------------------------------------------------------ */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Sparkles className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Description
            </h2>

            <p className="text-sm text-slate-500">
              Information about this membership plan.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {plan.description || "No description provided."}
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Plan Information                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <CalendarDays className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Plan Information
            </h2>

            <p className="text-sm text-slate-500">
              Creation and modification details.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <InfoItem
            label="Created"
            value={formatDate(plan.created_at)}
          />

          <InfoItem
            label="Last Updated"
            value={formatDate(plan.updated_at)}
          />
        </div>
      </section>
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

      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Info Item                                                                  */
/* -------------------------------------------------------------------------- */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Date                                                                       */
/* -------------------------------------------------------------------------- */

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}