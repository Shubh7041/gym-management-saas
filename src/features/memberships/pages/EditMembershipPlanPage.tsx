import { useEffect, useState } from "react";
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

  async function handleSubmit(values: MembershipPlanFormValues) {
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

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading membership plan...
      </div>
    );
  }

  if (error && !defaultValues) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-red-600">{error}</p>

        <button
          type="button"
          onClick={() => navigate("/dashboard/membership-plans")}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Back to Membership Plans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Membership Plan</h1>
        <p className="text-sm text-muted-foreground">
          Update the membership plan details.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <MembershipPlanForm
        defaultValues={defaultValues}
        loading={saving}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/dashboard/membership-plans")}
      />
    </div>
  );
}