import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Edit3,
  Loader2,
} from "lucide-react";
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

    void loadData();
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

      const hasOverlap =
        await memberSubscriptionsService.checkSubscriptionOverlap(
          values.member_id,
          values.start_date,
          values.end_date,
          id,
        );

      if (hasOverlap) {
        setError(
          "This member already has another active subscription during the selected dates.",
        );
        return;
      }

      await memberSubscriptionsService.updateSubscription(id, {
        plan_id: values.plan_id,
        start_date: values.start_date,
        end_date: values.end_date,
        amount: values.amount,
        status: values.status,
      });

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
      <div className="space-y-6">
        {/* Page header skeleton */}
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />

          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        {/* Form skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading subscription...
          </div>
        </div>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/subscriptions")
            }
            className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Back to subscriptions"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Subscription
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update subscription information.
            </p>
          </div>
        </div>

        {/* Error */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to load subscription
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error || "Subscription not found."}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/subscriptions")
          }
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Back to Subscriptions
        </button>
      </div>
    );
  }

  if (!subscription) {
    return null;
  }

  const defaultValues: Partial<MemberSubscriptionFormValues> = {
    member_id: subscription.member_id,
    plan_id: subscription.plan_id,
    start_date: subscription.start_date,
    end_date: subscription.end_date,
    amount: subscription.amount,
    status: subscription.status,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() =>
            navigate(`/dashboard/subscriptions/${id}`)
          }
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Back to subscription"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <CreditCard className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Edit Subscription
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Update the member's subscription details,
              dates, amount, or status.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to update subscription
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Edit3 className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Subscription Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Make the required changes below. The existing
                subscription information has been pre-filled.
              </p>
            </div>
          </div>
        </div>

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