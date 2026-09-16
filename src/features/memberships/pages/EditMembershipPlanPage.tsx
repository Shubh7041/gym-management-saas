import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Edit3,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import MembershipPlanForm from "../components/MembershipPlanForm";
import { membershipPlansService } from "../services/membership-plans.service";
import type { MembershipPlanFormValues } from "../schemas/membership-plan.schema";

export default function EditMembershipPlanPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [defaultValues, setDefaultValues] =
    useState<Partial<MembershipPlanFormValues>>();

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

        const plan = await membershipPlansService.getPlanById(id);

        setDefaultValues({
          name: plan.name,
          description: plan.description ?? "",
          duration_days: plan.duration_days,
          price: plan.price,
          status: plan.status,
        });
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

  async function handleSubmit(
    values: MembershipPlanFormValues,
  ) {
    if (!id) return;

    try {
      setSaving(true);
      setError(null);

      await membershipPlansService.updatePlan(id, {
        name: values.name,
        description: values.description || null,
        duration_days: values.duration_days,
        price: values.price,
        status: values.status,
      });

      navigate("/dashboard/membership-plans");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update membership plan.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                 */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />

          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading membership plan...
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Load Error                                                              */
  /* ---------------------------------------------------------------------- */

  if (error && !defaultValues) {
    return (
      <div className="space-y-6">
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

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Membership Plan
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update the membership plan details.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-red-800">
                Unable to load membership plan
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/membership-plans")
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Membership Plans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
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
            <Edit3 className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Membership Plan
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update the membership plan details.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Save Error                                                         */}
      {/* ------------------------------------------------------------------ */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to update membership plan
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Form                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <h2 className="text-base font-semibold text-slate-900">
            Plan Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Modify the plan information below and save your
            changes.
          </p>
        </div>

        <MembershipPlanForm
          defaultValues={defaultValues}
          loading={saving}
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate("/dashboard/membership-plans")
          }
        />
      </div>
    </div>
  );
}