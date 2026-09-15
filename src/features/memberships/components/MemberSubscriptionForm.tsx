import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  memberSubscriptionSchema,
  type MemberSubscriptionFormValues,
} from "../schemas/member-subscription.schema";

import type { Member } from "@/features/members/types/member.types";
import type { MembershipPlan } from "../types/membership-plan.types";

interface MemberSubscriptionFormProps {
  members: Member[];
  plans: MembershipPlan[];
  defaultValues?: Partial<MemberSubscriptionFormValues>;
  loading?: boolean;
  onSubmit: (values: MemberSubscriptionFormValues) => Promise<void>;
  onCancel: () => void;
}

export default function MemberSubscriptionForm({
  members,
  plans,
  defaultValues,
  loading = false,
  onSubmit,
  onCancel,
}: MemberSubscriptionFormProps) {
  const form = useForm<MemberSubscriptionFormValues>({
    resolver: zodResolver(memberSubscriptionSchema),
    defaultValues: {
      member_id: "",
      plan_id: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      status: "active",
      amount: 0,
      ...defaultValues,
    },
  });

  const selectedPlanId = form.watch("plan_id");
  const selectedStartDate = form.watch("start_date");

  useEffect(() => {
    if (!selectedPlanId || !selectedStartDate) {
      return;
    }

    const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);

    if (!selectedPlan) {
      return;
    }
    form.setValue("amount", selectedPlan.price, {
      shouldValidate: true,
      shouldDirty: true,
    });
    const startDate = new Date(`${selectedStartDate}T00:00:00`);

    startDate.setDate(startDate.getDate() + selectedPlan.duration_days - 1);

    const endDate = startDate.toISOString().split("T")[0];

    form.setValue("end_date", endDate, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [selectedPlanId, selectedStartDate, plans, form]);

  async function handleSubmit(values: MemberSubscriptionFormValues) {
    await onSubmit(values);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Member */}
      <div className="space-y-2">
        <label htmlFor="member_id" className="text-sm font-medium">
          Member
        </label>

        <select
          id="member_id"
          {...form.register("member_id")}
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ${
            form.formState.errors.member_id ? "border-red-500" : ""
          }`}
        >
          <option value="">Select member</option>

          {members
            .filter((member) => member.status === "active")
            .map((member) => (
              <option key={member.id} value={member.id}>
                {member.member_code} - {member.first_name}{" "}
                {member.last_name ?? ""}
              </option>
            ))}
        </select>

        {form.formState.errors.member_id && (
          <p className="text-sm text-red-600">
            {form.formState.errors.member_id.message}
          </p>
        )}
      </div>

      {/* Membership Plan */}
      <div className="space-y-2">
        <label htmlFor="plan_id" className="text-sm font-medium">
          Membership Plan
        </label>

        <select
          id="plan_id"
          {...form.register("plan_id")}
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ${
            form.formState.errors.plan_id ? "border-red-500" : ""
          }`}
        >
          <option value="">Select membership plan</option>

          {plans
            .filter((plan) => plan.status === "active")
            .map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - ₹{plan.price.toLocaleString("en-IN")} (
                {plan.duration_days} days)
              </option>
            ))}
        </select>

        {form.formState.errors.plan_id && (
          <p className="text-sm text-red-600">
            {form.formState.errors.plan_id.message}
          </p>
        )}
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <label htmlFor="start_date" className="text-sm font-medium">
          Start Date
        </label>

        <input
          id="start_date"
          type="date"
          {...form.register("start_date")}
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ${
            form.formState.errors.start_date ? "border-red-500" : ""
          }`}
        />

        {form.formState.errors.start_date && (
          <p className="text-sm text-red-600">
            {form.formState.errors.start_date.message}
          </p>
        )}
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <label htmlFor="end_date" className="text-sm font-medium">
          End Date
        </label>

        <input
          id="end_date"
          type="date"
          readOnly
          {...form.register("end_date")}
          className={`w-full rounded-md border bg-muted px-3 py-2 text-sm outline-none ${
            form.formState.errors.end_date ? "border-red-500" : ""
          }`}
        />

        <p className="text-xs text-muted-foreground">
          Automatically calculated from the selected plan.
        </p>

        {form.formState.errors.end_date && (
          <p className="text-sm text-red-600">
            {form.formState.errors.end_date.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount
        </label>

        <input
          id="amount"
          type="number"
          readOnly
          {...form.register("amount", {
            valueAsNumber: true,
          })}
          className={`w-full rounded-md border bg-muted px-3 py-2 text-sm outline-none ${
            form.formState.errors.amount ? "border-red-500" : ""
          }`}
        />

        <p className="text-xs text-muted-foreground">
          Automatically taken from the selected membership plan.
        </p>

        {form.formState.errors.amount && (
          <p className="text-sm text-red-600">
            {form.formState.errors.amount.message}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>

        <select
          id="status"
          {...form.register("status")}
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ${
            form.formState.errors.status ? "border-red-500" : ""
          }`}
        >
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {form.formState.errors.status && (
          <p className="text-sm text-red-600">
            {form.formState.errors.status.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Subscription"}
        </button>
      </div>
    </form>
  );
}
