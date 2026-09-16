import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MemberSubscriptionForm from "../components/MemberSubscriptionForm";
import type { MemberSubscriptionFormValues } from "../schemas/member-subscription.schema";

import { memberSubscriptionsService } from "../services/member-subscriptions.service";
import { membershipPlansService } from "../services/membership-plans.service";
import { membersService } from "@/features/members/services/members.service";

import type { MemberSubscription } from "../types/member-subscription.types";
import type { MembershipPlan } from "../types/membership-plan.types";
import type { Member } from "@/features/members/types/member.types";

export default function EditMemberSubscriptionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [subscription, setSubscription] =
    useState<MemberSubscription | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Subscription ID is missing.");
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const subscriptionData =
          await memberSubscriptionsService.getSubscriptionById(id);

        const [memberData, planData] = await Promise.all([
          membersService.getMembers(),
          membershipPlansService.getPlans(),
        ]);

        setSubscription(subscriptionData);
        setMembers(memberData);
        setPlans(planData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load subscription.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (
    values: MemberSubscriptionFormValues,
  ) => {
    if (!id) {
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await memberSubscriptionsService.updateSubscription(
        id,
        {
          plan_id: values.plan_id,
          start_date: values.start_date,
          end_date: values.end_date,
          amount: values.amount,
          status: values.status,
        },
      );

      navigate(`/dashboard/subscriptions/${id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update subscription.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-6 text-sm text-slate-500">
        Loading subscription...
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error || "Subscription not found."}
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/subscriptions")
          }
          className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Subscriptions
        </button>
      </div>
    );
  }

  const defaultValues: Partial<MemberSubscriptionFormValues> =
    {
      member_id: subscription.member_id,
      plan_id: subscription.plan_id,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      amount: subscription.amount,
      status: subscription.status,
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit Subscription
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update subscription information.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border bg-white p-6">
        <MemberSubscriptionForm
          members={members}
          plans={plans}
          defaultValues={defaultValues}
          loading={isSaving}
          isEditMode
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(`/dashboard/subscriptions/${id}`)
          }
        />
      </div>
    </div>
  );
}