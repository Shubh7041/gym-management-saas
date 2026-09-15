import { useState } from "react";
import { ArrowLeft } from "lucide-react";
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

  async function handleSubmit(values: MembershipPlanFormValues) {
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
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/membership-plans")
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
          aria-label="Back to membership plans"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Add Membership Plan
          </h1>

          <p className="text-sm text-muted-foreground">
            Create a membership plan for your gym.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!currentTenant ? (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          Gym information is still loading. Please try again.
        </div>
      ) : (
        <div className="rounded-xl border bg-background p-4 sm:p-6">
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