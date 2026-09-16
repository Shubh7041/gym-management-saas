import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Edit3,
  IndianRupee,
  User,
  XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { memberSubscriptionsService } from "../services/member-subscriptions.service";
import type { MemberSubscription } from "../types/member-subscription.types";

import { membersService } from "@/features/members/services/members.service";
import type { Member } from "@/features/members/types/member.types";

import { membershipPlansService } from "../services/membership-plans.service";
import type { MembershipPlan } from "../types/membership-plan.types";

export default function MemberSubscriptionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [subscription, setSubscription] =
    useState<MemberSubscription | null>(null);

  const [member, setMember] = useState<Member | null>(null);
  const [plan, setPlan] = useState<MembershipPlan | null>(null);

  const [isLoading, setIsLoading] = useState(true);
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
          membersService.getMemberById(
            subscriptionData.member_id,
          ),
          membershipPlansService.getPlanById(
            subscriptionData.plan_id,
          ),
        ]);

        setSubscription(subscriptionData);
        setMember(memberData);
        setPlan(planData);
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

  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusStyles = (
    status: MemberSubscription["status"],
  ) => {
    if (status === "active") {
      return {
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
      };
    }

    if (status === "expired") {
      return {
        className:
          "border-slate-200 bg-slate-100 text-slate-600",
        icon: CalendarDays,
      };
    }

    return {
      className: "border-red-200 bg-red-50 text-red-700",
      icon: XCircle,
    };
  };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                 */
  /* ---------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />

          <div className="space-y-2">
            <div className="h-6 w-52 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div className="h-12 w-12 animate-pulse rounded-full bg-slate-100" />
            <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                   */
  /* ---------------------------------------------------------------------- */

  if (error || !subscription) {
    return (
      <div className="space-y-6">
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

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Subscription Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View membership subscription information.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <XCircle className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-red-800">
                Unable to load subscription
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error || "Subscription not found."}
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/dashboard/subscriptions"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subscriptions
        </Link>
      </div>
    );
  }

  const statusStyles = getStatusStyles(subscription.status);
  const StatusIcon = statusStyles.icon;

  const memberName = member
    ? `${member.first_name}${
        member.last_name ? ` ${member.last_name}` : ""
      }`
    : "Unknown member";

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                Subscription Details
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View membership subscription information.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to={`/dashboard/subscriptions/${subscription.id}/renew`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <CalendarDays className="h-4 w-4" />
            Renew
          </Link>

          <Link
            to={`/dashboard/subscriptions/${subscription.id}/edit`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
          >
            <Edit3 className="h-4 w-4" />
            Edit Subscription
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Member / Subscription Summary                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {member?.first_name
                ?.charAt(0)
                .toUpperCase() ?? "?"}
            </div>

            <div>
              <p className="text-lg font-semibold text-slate-900">
                {memberName}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>
                  {member?.member_code ?? "No member code"}
                </span>

                <span className="text-slate-300">•</span>

                <span>
                  {plan?.name ?? "Unknown plan"}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${statusStyles.className}`}
          >
            <StatusIcon className="h-4 w-4" />
            {subscription.status}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Membership Information                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />

            <h2 className="text-sm font-semibold text-slate-900">
              Membership Information
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Details of this member's current subscription.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <InfoCard
            label="Member"
            value={memberName}
          />

          <InfoCard
            label="Member Code"
            value={member?.member_code ?? "-"}
          />

          <InfoCard
            label="Membership Plan"
            value={plan?.name ?? "Unknown plan"}
          />

          <InfoCard
            label="Amount"
            value={formatAmount(subscription.amount)}
            icon={<IndianRupee className="h-4 w-4" />}
          />

          <InfoCard
            label="Start Date"
            value={formatDate(subscription.start_date)}
            icon={<CalendarDays className="h-4 w-4" />}
          />

          <InfoCard
            label="End Date"
            value={formatDate(subscription.end_date)}
            icon={<CalendarDays className="h-4 w-4" />}
          />

          <InfoCard
            label="Status"
            value={subscription.status}
            capitalize
          />

          <InfoCard
            label="Created"
            value={new Date(
              subscription.created_at,
            ).toLocaleString("en-IN")}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Plan Snapshot                                                      */}
      {/* ------------------------------------------------------------------ */}

      {plan && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Plan Snapshot
              </p>

              <h3 className="mt-1 text-base font-semibold text-slate-900">
                {plan.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {plan.duration_days} day
                {plan.duration_days !== 1 ? "s" : ""} plan
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-lg font-bold text-slate-900">
              <IndianRupee className="h-4 w-4" />
              {plan.price.toLocaleString("en-IN")}
            </div>
          </div>

          {plan.description && (
            <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600">
              {plan.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Info Card                                                                  */
/* -------------------------------------------------------------------------- */

function InfoCard({
  label,
  value,
  icon,
  capitalize = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-1.5">
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <p
          className={`text-sm font-semibold text-slate-900 ${
            capitalize ? "capitalize" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}