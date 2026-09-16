import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MemberSubscriptionForm from "../components/MemberSubscriptionForm";

import { memberSubscriptionsService } from "../services/member-subscriptions.service";
import { membershipPlansService } from "../services/membership-plans.service";

import type { MemberSubscription } from "../types/member-subscription.types";
import type { MembershipPlan } from "../types/membership-plan.types";
import type { MemberSubscriptionFormValues } from "../schemas/member-subscription.schema";

import { membersService } from "@/features/members/services/members.service";
import type { Member } from "@/features/members/types/member.types";

import { useAppStore } from "@/stores/app.store";

import {
  calculateRenewalStartDate,
  calculateSubscriptionEndDate,
} from "../utils/subscription-date.utils";

export default function RenewMemberSubscriptionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentTenant = useAppStore((state) => state.currentTenant);

  const [subscription, setSubscription] =
    useState<MemberSubscription | null>(null);

  const [member, setMember] = useState<Member | null>(null);
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

        const [memberData, plansData] = await Promise.all([
          membersService.getMemberById(subscriptionData.member_id),
          membershipPlansService.getPlans(),
        ]);

        setSubscription(subscriptionData);
        setMember(memberData);

        setPlans(
          plansData.filter(
            (plan) => plan.status === "active",
          ),
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load renewal data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [id]);

  const handleSubmit = async (
    values: MemberSubscriptionFormValues,
  ) => {
    if (!subscription) {
      setError("Original subscription is missing.");
      return;
    }

    if (!currentTenant) {
      setError("No active gym selected.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

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
        amount: values.amount,
        status: "active",
      });

      navigate(`/dashboard/subscriptions/${subscription.id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to renew subscription.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-6 text-sm text-slate-500">
        Loading renewal data...
      </div>
    );
  }

  if (error || !subscription || !member) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error || "Unable to load subscription."}
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

  const renewalStartDate = calculateRenewalStartDate(
    subscription.end_date,
  );

  const defaultPlan = plans.find(
    (plan) => plan.id === subscription.plan_id,
  );

  const renewalEndDate = defaultPlan
    ? calculateSubscriptionEndDate(
        renewalStartDate,
        defaultPlan.duration_days,
      )
    : "";

  const defaultValues: Partial<MemberSubscriptionFormValues> = {
    member_id: subscription.member_id,
    plan_id: defaultPlan?.id ?? "",
    start_date: renewalStartDate,
    end_date: renewalEndDate,
    amount: defaultPlan?.price ?? 0,
    status: "active",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Renew Subscription
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new subscription period for this member.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <div className="mb-6 rounded-md bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Member
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {member.member_code} - {member.first_name}
            {member.last_name
              ? ` ${member.last_name}`
              : ""}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Previous subscription ends on{" "}
            <span className="font-medium">
              {subscription.end_date}
            </span>
            . The renewal will start on{" "}
            <span className="font-medium">
              {renewalStartDate}
            </span>
            .
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <MemberSubscriptionForm
          members={[member]}
          plans={plans}
          defaultValues={defaultValues}
          loading={isSaving}
          isRenewalMode
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(
              `/dashboard/subscriptions/${subscription.id}`,
            )
          }
        />
      </div>
    </div>
  );
}