import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Loader2,
  Plus,
} from "lucide-react";
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

  const currentTenant = useAppStore(
    (state) => state.currentTenant,
  );

  const selectedBranchId = useAppStore(
    (state) => state.selectedBranchId,
  );

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
                (member) =>
                  member.branch_id === selectedBranchId,
              )
            : membersData,
        );

        setPlans(
          plansData.filter(
            (plan) => plan.status === "active",
          ),
        );
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

  async function handleSubmit(
    values: MemberSubscriptionFormValues,
  ) {
    if (!currentTenant) {
      setError("No active gym selected.");
      return;
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    if (
      values.status === "active" &&
      values.start_date < today
    ) {
      setError(
        "An active subscription cannot start before today.",
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

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
        err instanceof Error
          ? err.message
          : "Failed to create subscription.",
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
            <div className="h-6 w-52 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading subscription data...
          </div>
        </div>
      </div>
    );
  }

  const defaultValues: Partial<MemberSubscriptionFormValues> =
    memberIdFromUrl
      ? {
          member_id: memberIdFromUrl,
        }
      : {};

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/subscriptions")
          }
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          aria-label="Back to subscriptions"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <CreditCard className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create Subscription
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Assign a membership plan to a gym member.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Error                                                              */}
      {/* ------------------------------------------------------------------ */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to create subscription
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
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Subscription Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a member and membership plan. Dates and
                amount will be calculated from the selected plan.
              </p>
            </div>
          </div>
        </div>

        <MemberSubscriptionForm
          members={members}
          plans={plans}
          defaultValues={defaultValues}
          loading={saving}
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate("/dashboard/subscriptions")
          }
        />
      </div>
    </div>
  );
}