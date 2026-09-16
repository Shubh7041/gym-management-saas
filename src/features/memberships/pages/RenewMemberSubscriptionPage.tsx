import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
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

  const currentTenant = useAppStore(
    (state) => state.currentTenant,
  );

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
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />

          <div className="space-y-2">
            <div className="h-6 w-52 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading renewal data...
          </div>
        </div>
      </div>
    );
  }

  if (error || !subscription || !member) {
    return (
      <div className="space-y-6">
        {/* Header */}
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
              Renew Subscription
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a new subscription period for this member.
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
                Unable to load renewal
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error || "Unable to load subscription."}
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

  const memberName = `${member.first_name}${
    member.last_name ? ` ${member.last_name}` : ""
  }`;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() =>
            navigate(
              `/dashboard/subscriptions/${subscription.id}`,
            )
          }
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Back to subscription"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <RefreshCw className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Renew Subscription
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a new subscription period for this member.
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
                Unable to renew subscription
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Renewal summary */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CreditCard className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Renewal Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review the previous subscription period and
                the new renewal dates.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {/* Member */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Member
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {member.first_name?.charAt(0)?.toUpperCase() || "M"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {memberName}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {member.member_code}
                </p>
              </div>
            </div>
          </div>

          {/* Previous subscription */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-400" />

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Previous Period
              </p>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-900">
              Ends {subscription.end_date}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Current subscription end date
            </p>
          </div>

          {/* New renewal */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                New Renewal
              </p>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-900">
              Starts {renewalStartDate}
            </p>

            <p className="mt-1 text-xs text-emerald-700">
              Continues immediately after the previous period
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <RefreshCw className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Renewal Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select the membership plan for the new
                subscription period.
              </p>
            </div>
          </div>
        </div>

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