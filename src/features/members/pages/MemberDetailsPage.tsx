import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  User,
  Users,
} from "lucide-react";

import { membersService } from "../services/members.service";
import type { Member } from "../types/member.types";

import { memberSubscriptionsService } from "@/features/memberships/services/member-subscriptions.service";
import type { MemberSubscription } from "@/features/memberships/types/member-subscription.types";

import { membershipPlansService } from "@/features/memberships/services/membership-plans.service";
import type { MembershipPlan } from "@/features/memberships/types/membership-plan.types";

import { useAppStore } from "@/stores/app.store";

export default function MemberDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const branches = useAppStore((state) => state.branches);

  const [member, setMember] = useState<Member | null>(null);
  const [subscriptions, setSubscriptions] = useState<MemberSubscription[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Member ID is missing.");
      setLoading(false);
      return;
    }

    async function loadMember() {
      try {
        if (!id) {
          return;
        }
        setLoading(true);
        setError(null);

        const [memberData, subscriptionData, plansData] = await Promise.all([
          membersService.getMemberById(id),
          memberSubscriptionsService.getSubscriptionsByMember(id),
          membershipPlansService.getPlans(),
        ]);

        setMember(memberData);
        setSubscriptions(subscriptionData);
        setPlans(plansData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load member.");
      } finally {
        setLoading(false);
      }
    }

    loadMember();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-2xl bg-slate-200" />

            <div className="space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => navigate("/dashboard/members")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <User className="mx-auto h-8 w-8 text-slate-400" />

        <p className="mt-3 text-sm font-medium text-slate-900">
          Member not found
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard/members")}
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          Back to Members
        </button>
      </div>
    );
  }

  const branch = branches.find((item) => item.id === member.branch_id);

  const fullName = [member.first_name, member.last_name]
    .filter(Boolean)
    .join(" ");

  const latestSubscription = subscriptions[0];

  const latestPlan = latestSubscription
    ? plans.find((plan) => plan.id === latestSubscription.plan_id)
    : undefined;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/members")}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Members
      </button>

      {/* Member Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
              {member.first_name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900">
                  {fullName}
                </h1>

                <MemberStatusBadge status={member.status} />
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="font-mono text-xs">{member.member_code}</span>

                {branch && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {branch.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/dashboard/members/${member.id}/edit`)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
          >
            <Pencil className="h-4 w-4" />
            Edit Member
          </button>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Basic Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <SectionHeader
            icon={User}
            title="Basic Information"
            description="Member profile and contact information."
          />

          <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="First Name" value={member.first_name} />

            <InfoItem label="Last Name" value={member.last_name ?? "—"} />

            <InfoItem label="Phone" value={member.phone ?? "—"} icon={Phone} />

            <InfoItem label="Email" value={member.email ?? "—"} icon={Mail} />

            <InfoItem
              label="Date of Birth"
              value={formatDate(member.date_of_birth)}
            />

            <InfoItem
              label="Gender"
              value={member.gender ? capitalize(member.gender) : "—"}
              icon={Users}
            />

            <InfoItem
              label="Join Date"
              value={formatDate(member.join_date)}
              icon={CalendarDays}
            />

            <InfoItem
              label="Branch"
              value={branch?.name ?? "Unknown branch"}
              icon={MapPin}
            />

            <InfoItem label="Member Code" value={member.member_code} />
          </div>
        </section>

        {/* Contact / Address */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={MapPin}
            title="Address"
            description="Member's registered address."
          />

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm leading-6 text-slate-600">
              {member.address || "No address provided."}
            </p>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Member Since
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formatDate(member.join_date)}
            </p>
          </div>
        </section>
      </div>

      {/* Membership */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            icon={CreditCard}
            title="Membership"
            description="Current and recent membership information."
          />

          <button
            type="button"
            onClick={() =>
              navigate(`/dashboard/subscriptions/new?memberId=${member.id}`)
            }
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Add Subscription
          </button>
        </div>

        {!latestSubscription ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <CreditCard className="h-5 w-5 text-slate-400" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-900">
              No subscription found
            </p>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              This member does not have a membership subscription yet.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(`/dashboard/subscriptions/new?memberId=${member.id}`)
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Subscription
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
            {/* Plan */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Current Plan
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {latestPlan?.name ?? "Unknown plan"}
                  </p>
                </div>
              </div>

              <SubscriptionStatusBadge status={latestSubscription.status} />
            </div>

            {/* Details */}
            <div className="mt-6 grid gap-5 border-t border-slate-200 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <InfoItem
                label="Start Date"
                value={formatDate(latestSubscription.start_date)}
              />

              <InfoItem
                label="End Date"
                value={formatDate(latestSubscription.end_date)}
              />

              <InfoItem
                label="Amount"
                value={formatCurrency(latestSubscription.amount)}
              />

              <InfoItem
                label="Duration"
                value={latestPlan ? `${latestPlan.duration_days} days` : "—"}
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() =>
                  navigate(`/dashboard/subscriptions/${latestSubscription.id}`)
                }
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <CalendarDays className="h-4 w-4" />
                View Subscription
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/dashboard/subscriptions/${latestSubscription.id}/edit`,
                  )
                }
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Pencil className="h-4 w-4" />
                Edit Subscription
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Subscription History */}
      {subscriptions.length > 1 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={CalendarDays}
            title="Subscription History"
            description="Previous memberships for this member."
          />

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Plan
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Start
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    End
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {subscriptions.map((subscription) => {
                  const plan = plans.find(
                    (item) => item.id === subscription.plan_id,
                  );

                  return (
                    <tr
                      key={subscription.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {plan?.name ?? "Unknown plan"}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(subscription.start_date)}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(subscription.end_date)}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatCurrency(subscription.amount)}
                      </td>

                      <td className="px-4 py-3">
                        <SubscriptionStatusBadge status={subscription.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>

        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ElementType;
}

function InfoItem({ label, value, icon: Icon }: InfoItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1.5 flex min-w-0 items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />}

        <p className="truncate text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

interface MemberStatusBadgeProps {
  status: Member["status"];
}

function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  const statusClasses = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    blocked: "bg-red-50 text-red-700 ring-red-600/20",
    inactive: "bg-slate-100 text-slate-600 ring-slate-500/20",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "text-xs font-semibold ring-1 ring-inset",
        statusClasses[status] ??
          "bg-slate-100 text-slate-600 ring-slate-500/20",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          status === "active"
            ? "bg-emerald-500"
            : status === "blocked"
              ? "bg-red-500"
              : "bg-slate-400",
        ].join(" ")}
      />

      {capitalize(status)}
    </span>
  );
}

interface SubscriptionStatusBadgeProps {
  status: MemberSubscription["status"];
}

function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  const statusClasses = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    expired: "bg-orange-50 text-orange-700 ring-orange-600/20",
    cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "text-xs font-semibold ring-1 ring-inset",
        statusClasses[status],
      ].join(" ")}
    >
      {status === "active" && <CheckCircle2 className="h-3.5 w-3.5" />}

      {capitalize(status)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
