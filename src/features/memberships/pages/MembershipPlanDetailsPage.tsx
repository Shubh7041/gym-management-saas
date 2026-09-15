import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";

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

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading membership plan...
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-red-600">
          {error ?? "Membership plan not found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard/membership-plans")}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          Back to Membership Plans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/membership-plans")}
            className="mt-1 rounded-md border p-2 hover:bg-muted"
            aria-label="Back to membership plans"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-2xl font-semibold">{plan.name}</h1>
            <p className="text-sm text-muted-foreground">
              Membership plan details
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(`/dashboard/membership-plans/${plan.id}/edit`)
          }
          className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          <Edit className="h-4 w-4" />
          Edit Plan
        </button>
      </div>

      {/* Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Plan Name</p>
          <p className="mt-1 font-medium">{plan.name}</p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="mt-1 font-medium capitalize">{plan.status}</p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Duration</p>
          <p className="mt-1 font-medium">
            {plan.duration_days} days
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="mt-1 font-medium">
            ₹{plan.price.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5 md:col-span-2">
          <p className="text-sm text-muted-foreground">Description</p>

          <p className="mt-1">
            {plan.description || "No description provided."}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Created</p>
          <p className="mt-1 font-medium">
            {new Date(plan.created_at).toLocaleDateString("en-IN")}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Last Updated</p>
          <p className="mt-1 font-medium">
            {new Date(plan.updated_at).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}