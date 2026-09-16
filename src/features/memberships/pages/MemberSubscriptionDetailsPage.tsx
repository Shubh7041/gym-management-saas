import { useEffect, useState } from "react";
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
          membersService.getMemberById(subscriptionData.member_id),
          membershipPlansService.getPlanById(subscriptionData.plan_id),
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

    loadData();
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
          onClick={() => navigate("/dashboard/subscriptions")}
          className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Subscriptions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Subscription Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View membership subscription information.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/dashboard/subscriptions"
            className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back
          </Link>

          <Link
            to={`/dashboard/subscriptions/${subscription.id}/edit`}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Edit Subscription
          </Link>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Membership Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Member</p>
            <p className="mt-1 font-medium text-slate-900">
              {member
                ? `${member.first_name}${
                    member.last_name
                      ? ` ${member.last_name}`
                      : ""
                  }`
                : "Unknown member"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Member Code</p>
            <p className="mt-1 font-medium text-slate-900">
              {member?.member_code ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Membership Plan</p>
            <p className="mt-1 font-medium text-slate-900">
              {plan?.name ?? "Unknown plan"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Amount</p>
            <p className="mt-1 font-medium text-slate-900">
              {formatAmount(subscription.amount)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Start Date</p>
            <p className="mt-1 font-medium text-slate-900">
              {formatDate(subscription.start_date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">End Date</p>
            <p className="mt-1 font-medium text-slate-900">
              {formatDate(subscription.end_date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-1 font-medium capitalize text-slate-900">
              {subscription.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Created</p>
            <p className="mt-1 font-medium text-slate-900">
              {new Date(subscription.created_at).toLocaleString(
                "en-IN",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}