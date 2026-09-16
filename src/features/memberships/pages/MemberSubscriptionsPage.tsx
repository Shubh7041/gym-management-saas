import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { memberSubscriptionsService } from "../services/member-subscriptions.service";
import type { MemberSubscription } from "../types/member-subscription.types";

import { membersService } from "@/features/members/services/members.service";
import type { Member } from "@/features/members/types/member.types";

import { membershipPlansService } from "../services/membership-plans.service";
import type { MembershipPlan } from "../types/membership-plan.types";

export default function MemberSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<MemberSubscription[]>([]);

  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [subscriptionData, memberData, planData] = await Promise.all([
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

    loadData();
  }, []);

  const getMemberName = (memberId: string) => {
    const member = members.find((item) => item.id === memberId);

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
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusClassName = (status: MemberSubscription["status"]) => {
    if (status === "active") {
      return "bg-green-100 text-green-700";
    }

    if (status === "expired") {
      return "bg-slate-100 text-slate-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Subscriptions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage member membership subscriptions.
          </p>
        </div>

        <Link
          to="/dashboard/subscriptions/new"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Add Subscription
        </Link>
      </div>

      {isLoading && (
        <div className="rounded-lg border bg-white p-6 text-sm text-slate-500">
          Loading subscriptions...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && subscriptions.length === 0 && (
        <div className="rounded-lg border bg-white p-8 text-center">
          <h2 className="text-lg font-medium text-slate-900">
            No subscriptions found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create your first member subscription to get started.
          </p>

          <Link
            to="/dashboard/subscriptions/new"
            className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add Subscription
          </Link>
        </div>
      )}

      {!isLoading && !error && subscriptions.length > 0 && (
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">
                    Member
                  </th>

                  <th className="px-4 py-3 font-medium text-slate-600">Plan</th>

                  <th className="px-4 py-3 font-medium text-slate-600">
                    Start Date
                  </th>

                  <th className="px-4 py-3 font-medium text-slate-600">
                    End Date
                  </th>

                  <th className="px-4 py-3 font-medium text-slate-600">
                    Amount
                  </th>

                  <th className="px-4 py-3 font-medium text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {getMemberName(subscription.member_id)}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {getPlanName(subscription.plan_id)}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(subscription.start_date)}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(subscription.end_date)}
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatAmount(subscription.amount)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClassName(
                          subscription.status,
                        )}`}
                      >
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/dashboard/subscriptions/${subscription.id}`}
                        className="font-medium text-slate-700 hover:text-slate-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
