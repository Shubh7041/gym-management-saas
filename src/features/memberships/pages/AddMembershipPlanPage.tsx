import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MembershipPlanForm from "../components/MembershipPlanForm";
import { membershipPlansService } from "../services/membership-plans.service";

import { useAppStore } from "@/stores/app.store";
import type { MembershipPlanFormValues } from "../schemas/membership-plan.schema";

export default function AddMembershipPlanPage() {
  const navigate = useNavigate();

  const currentTenant = useAppStore(
    (state) => state.currentTenant,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    values: MembershipPlanFormValues,
  ) {
    if (!currentTenant) {
      setError("Gym information is not available.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await membershipPlansService.createPlan({
        tenant_id: currentTenant.id,
        name: values.name.trim(),
        description: values.description?.trim() || null,
        duration_days: values.duration_days,
        price: values.price,
        status: values.status,
      });

      navigate("/dashboard/membership-plans");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create membership plan.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/membership-plans")
          }
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          aria-label="Back to membership plans"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Add Membership Plan
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a membership plan for your gym.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Error                                                                */}
      {/* ------------------------------------------------------------------ */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to create membership plan
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Tenant Loading / Missing State                                      */}
      {/* ------------------------------------------------------------------ */}

      {!currentTenant ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Gym information is not available
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Gym information is still loading. Please try
                again.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ---------------------------------------------------------------- */
        /* Form                                                              */
        /* ---------------------------------------------------------------- */
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-6 border-b border-slate-100 pb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Plan Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure the price, duration and availability of
              this membership plan.
            </p>
          </div>

          <MembershipPlanForm
            loading={loading}
            onSubmit={handleSubmit}
            onCancel={() =>
              navigate("/dashboard/membership-plans")
            }
          />
        </div>
      )}
    </div>
  );
}