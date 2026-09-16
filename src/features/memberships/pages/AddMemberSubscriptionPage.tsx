import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import MemberSubscriptionForm from "../components/MemberSubscriptionForm";

import { memberSubscriptionsService } from "../services/member-subscriptions.service";
import { membershipPlansService } from "../services/membership-plans.service";

import { membersService } from "@/features/members/services/members.service";

import type { Member } from "@/features/members/types/member.types";
import type { MembershipPlan } from "../types/membership-plan.types";
import type { MemberSubscriptionFormValues } from "../schemas/member-subscription.schema";

import { useAppStore } from "@/stores/app.store";

export default function AddMemberSubscriptionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentTenant = useAppStore((state) => state.currentTenant);
  const selectedBranchId = useAppStore((state) => state.selectedBranchId);

  const memberIdFromUrl = searchParams.get("memberId");

  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [membersData, plansData] = await Promise.all([
          membersService.getMembers(),
          membershipPlansService.getPlans(),
        ]);

        setMembers(
          selectedBranchId
            ? membersData.filter(
                (member) => member.branch_id === selectedBranchId,
              )
            : membersData,
        );

        setPlans(plansData.filter((plan) => plan.status === "active"));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load subscription data.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [selectedBranchId]);

  async function handleSubmit(values: MemberSubscriptionFormValues) {
    if (!currentTenant) {
      setError("No active gym selected.");
      return;
    }
    const today = new Date().toISOString().split("T")[0];

    if (values.status === "active" && values.start_date < today) {
      setError("An active subscription cannot start before today.");
      return;
    }
    try {
      setSaving(true);
      setError(null);

      // Check for overlapping active subscription
      const hasOverlap =
        await memberSubscriptionsService.checkSubscriptionOverlap(
          values.member_id,
          values.start_date,
          values.end_date,
        );

      if (hasOverlap) {
        setError(
          "This member already has an active subscription during the selected dates.",
        );
        return;
      }

      await memberSubscriptionsService.createSubscription({
        tenant_id: currentTenant.id,
        member_id: values.member_id,
        plan_id: values.plan_id,
        start_date: values.start_date,
        end_date: values.end_date,
        status: values.status,
        amount: values.amount,
      });

      navigate("/dashboard/subscriptions");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create subscription.",
      );
    } finally {
      setSaving(false);
    }
  }
  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading subscription data...
      </div>
    );
  }

  const defaultValues: Partial<MemberSubscriptionFormValues> = memberIdFromUrl
    ? {
        member_id: memberIdFromUrl,
      }
    : {};

  return (
    <div className="max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Subscription</h1>

        <p className="text-sm text-muted-foreground">
          Assign a membership plan to a gym member.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <MemberSubscriptionForm
        members={members}
        plans={plans}
        defaultValues={defaultValues}
        loading={saving}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/dashboard/subscriptions")}
      />
    </div>
  );
}
