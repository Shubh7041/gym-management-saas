import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Pencil,
  Plus,
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
      <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
        Loading member information...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/members")}
          className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </button>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
        Member not found.
      </div>
    );
  }

  const branch = branches.find((item) => item.id === member.branch_id);

  const fullName = [member.first_name, member.last_name]
    .filter(Boolean)
    .join(" ");

  /*
   * The subscription service returns subscriptions ordered by
   * start_date descending, so the first item is the latest one.
   */
  const latestSubscription = subscriptions[0];

  const latestPlan = latestSubscription
    ? plans.find((plan) => plan.id === latestSubscription.plan_id)
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/members")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
            aria-label="Back to members"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>

            <p className="text-sm text-muted-foreground">Member details</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/dashboard/members/${member.id}/edit`)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Pencil className="h-4 w-4" />
          Edit Member
        </button>
      </div>

      {/* Profile */}
      <div className="rounded-xl border bg-background p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold">Basic Information</h2>

          <p className="text-sm text-muted-foreground">
            Member profile and contact information.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Member Code" value={member.member_code} />

          <InfoItem label="Branch" value={branch?.name ?? "Unknown branch"} />

          <InfoItem label="Status" value={formatStatus(member.status)} />

          <InfoItem label="First Name" value={member.first_name} />

          <InfoItem label="Last Name" value={member.last_name ?? "—"} />

          <InfoItem label="Phone" value={member.phone ?? "—"} />

          <InfoItem label="Email" value={member.email ?? "—"} />

          <InfoItem
            label="Date of Birth"
            value={formatDate(member.date_of_birth)}
          />

          <InfoItem
            label="Gender"
            value={member.gender ? capitalize(member.gender) : "—"}
          />

          <InfoItem label="Join Date" value={formatDate(member.join_date)} />
        </div>
      </div>

      {/* Membership */}
      <div className="rounded-xl border bg-background p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Membership</h2>

            <p className="text-sm text-muted-foreground">
              Current and recent membership information.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/dashboard/subscriptions/new?memberId=${member.id}`)
            }
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
            Add Subscription
          </button>
        </div>

        {!latestSubscription ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <CreditCard className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

            <p className="text-sm font-medium">No subscription found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              This member does not have any membership subscription yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Plan header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Membership Plan
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {latestPlan?.name ?? "Unknown plan"}
                </p>
              </div>

              <StatusBadge status={latestSubscription.status} />
            </div>

            {/* Membership details */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="flex flex-wrap gap-3 border-t pt-5">
              <button
                type="button"
                onClick={() =>
                  navigate(`/dashboard/subscriptions/${latestSubscription.id}`)
                }
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted"
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
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
                Edit Subscription
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Address */}
      <div className="rounded-xl border bg-background p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold">Address</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          {member.address || "No address provided."}
        </p>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

interface StatusBadgeProps {
  status: MemberSubscription["status"];
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusClasses = {
    active: "border-green-200 bg-green-50 text-green-700",
    expired: "border-orange-200 bg-orange-50 text-orange-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}
    >
      {capitalize(status)}
    </span>
  );
}

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

function formatStatus(status: Member["status"]) {
  return capitalize(status);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
