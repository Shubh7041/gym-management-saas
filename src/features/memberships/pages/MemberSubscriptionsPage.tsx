import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Eye,
  IndianRupee,
  Plus,
  ReceiptText,
  Users,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { memberSubscriptionsService } from "../services/member-subscriptions.service";
import type { MemberSubscription } from "../types/member-subscription.types";

import { membersService } from "@/features/members/services/members.service";
import type { Member } from "@/features/members/types/member.types";

import { membershipPlansService } from "../services/membership-plans.service";
import type { MembershipPlan } from "../types/membership-plan.types";

export default function MemberSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<
    MemberSubscription[]
  >([]);

  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [
          subscriptionData,
          memberData,
          planData,
        ] = await Promise.all([
          memberSubscriptionsService.getSubscriptions(),
          membersService.getMembers(),
          membershipPlansService.getPlans(),
        ]);

        setSubscriptions(subscriptionData);
        setMembers(memberData);
        setPlans(planData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load subscriptions.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const getMember = (memberId: string) => {
    return members.find((item) => item.id === memberId);
  };

  const getMemberName = (memberId: string) => {
    const member = getMember(memberId);

    if (!member) {
      return "Unknown member";
    }

    return `${member.first_name}${
      member.last_name ? ` ${member.last_name}` : ""
    }`;
  };

  const getPlanName = (planId: string) => {
    const plan = plans.find((item) => item.id === planId);

    return plan?.name ?? "Unknown plan";
  };

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

  const summary = useMemo(() => {
    return {
      total: subscriptions.length,
      active: subscriptions.filter(
        (item) => item.status === "active",
      ).length,
      expired: subscriptions.filter(
        (item) => item.status === "expired",
      ).length,
      cancelled: subscriptions.filter(
        (item) => item.status === "cancelled",
      ).length,
    };
  }, [subscriptions]);

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

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <CreditCard className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Subscriptions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage member membership subscriptions.
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/subscriptions/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
        >
          <Plus className="h-4 w-4" />
          Add Subscription
        </Link>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Summary Cards                                                      */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total"
            value={summary.total}
            icon={ReceiptText}
          />

          <SummaryCard
            label="Active"
            value={summary.active}
            icon={CheckCircle2}
            iconClassName="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            label="Expired"
            value={summary.expired}
            icon={CalendarDays}
            iconClassName="bg-slate-100 text-slate-600"
          />

          <SummaryCard
            label="Cancelled"
            value={summary.cancelled}
            icon={XCircle}
            iconClassName="bg-red-50 text-red-600"
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Loading                                                            */}
      {/* ------------------------------------------------------------------ */}

      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Error                                                              */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <XCircle className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-red-800">
                Unable to load subscriptions
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Empty State                                                        */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading &&
        !error &&
        subscriptions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CreditCard className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No subscriptions found
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Create your first member subscription to start
              tracking memberships and renewals.
            </p>

            <Link
              to="/dashboard/subscriptions/new"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Subscription
            </Link>
          </div>
        )}

      {/* ------------------------------------------------------------------ */}
      {/* Subscription Table                                                 */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading &&
        !error &&
        subscriptions.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  All Subscriptions
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {subscriptions.length} subscription
                  {subscriptions.length !== 1 ? "s" : ""}
                </p>
              </div>

              <Users className="h-5 w-5 text-slate-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Member
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Plan
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Start Date
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      End Date
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {subscriptions.map((subscription) => {
                    const member = getMember(
                      subscription.member_id,
                    );

                    const memberName =
                      getMemberName(subscription.member_id);

                    const statusStyles = getStatusStyles(
                      subscription.status,
                    );

                    const StatusIcon = statusStyles.icon;

                    return (
                      <tr
                        key={subscription.id}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        {/* Member */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {member?.first_name
                                ?.charAt(0)
                                .toUpperCase() ?? "?"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {memberName}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {member?.member_code ??
                                  "No member code"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="px-5 py-4">
                          <span className="font-medium text-slate-700">
                            {getPlanName(
                              subscription.plan_id,
                            )}
                          </span>
                        </td>

                        {/* Start Date */}
                        <td className="px-5 py-4 text-slate-600">
                          {formatDate(subscription.start_date)}
                        </td>

                        {/* End Date */}
                        <td className="px-5 py-4 text-slate-600">
                          {formatDate(subscription.end_date)}
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                            <IndianRupee className="h-3.5 w-3.5 text-slate-400" />
                            {formatAmount(
                              subscription.amount,
                            ).replace("₹", "")}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {subscription.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">
                          <Link
                            to={`/dashboard/subscriptions/${subscription.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary Card                                                               */
/* -------------------------------------------------------------------------- */

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName = "bg-primary/10 text-primary",
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}