import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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
    const nextStatus = plan.status === "active" ? "inactive" : "active";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Membership Plans
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage the membership plans offered by your gym.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/membership-plans/new")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Plan
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          Loading membership plans...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && plans.length === 0 && (
        <div className="rounded-xl border border-dashed bg-background p-10 text-center">
          <h2 className="text-base font-semibold">No membership plans yet</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first membership plan to get started.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/membership-plans/new")}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create First Plan
          </button>
        </div>
      )}

      {!loading && !error && plans.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-background">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead className="border-b bg-muted/40">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Plan Name</th>

                  <th className="px-4 py-3 font-medium">Duration</th>

                  <th className="px-4 py-3 font-medium">Price</th>

                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-muted/20">
                    <td className="px-4 py-4">
                      <div className="font-medium">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/dashboard/membership-plans/${plan.id}`)
                          }
                          className="font-medium hover:underline"
                        >
                          {plan.name}
                        </button>
                      </div>

                      {plan.description && (
                        <div className="mt-1 max-w-sm text-xs text-muted-foreground">
                          {plan.description}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">{plan.duration_days} days</td>

                    <td className="px-4 py-4 font-medium">
                      ₹{Number(plan.price).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          plan.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {capitalize(plan.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/dashboard/membership-plans/${plan.id}`)
                          }
                          className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/dashboard/membership-plans/${plan.id}/edit`,
                            )
                          }
                          className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleToggleStatus(plan)}
                          className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                        >
                          {plan.status === "active" ? "Deactivate" : "Activate"}
                        </button>
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

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
