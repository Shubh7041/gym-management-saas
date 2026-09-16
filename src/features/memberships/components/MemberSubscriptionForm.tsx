import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { memberSubscriptionSchema } from "../schemas/member-subscription.schema";
import type { MemberSubscriptionFormValues } from "../schemas/member-subscription.schema";
import type { Member } from "@/features/members/types/member.types";
import type { MembershipPlan } from "../types/membership-plan.types";

interface MemberSubscriptionFormProps {
  members: Member[];
  plans: MembershipPlan[];
  defaultValues?: Partial<MemberSubscriptionFormValues>;
  loading?: boolean;
  isEditMode?: boolean;
  onSubmit: (
    values: MemberSubscriptionFormValues,
  ) => Promise<void>;
  onCancel: () => void;
}

export default function MemberSubscriptionForm({
  members,
  plans,
  defaultValues,
  loading = false,
  isEditMode = false,
  onSubmit,
  onCancel,
}: MemberSubscriptionFormProps) {
  const activeMembers = members.filter(
    (member) => member.status === "active",
  );

  const activePlans = plans.filter(
    (plan) => plan.status === "active",
  );

  const form = useForm<MemberSubscriptionFormValues>({
    resolver: zodResolver(memberSubscriptionSchema),
    defaultValues: {
      member_id: "",
      plan_id: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      amount: 0,
      status: "active",
      ...defaultValues,
    },
  });

  const selectedPlanId = form.watch("plan_id");
  const selectedStartDate = form.watch("start_date");

  /*
   * Create mode:
   * Automatically calculate amount and end date from the selected plan.
   *
   * Edit mode:
   * Preserve the existing amount and end date.
   */
  useEffect(() => {
    if (isEditMode) {
      return;
    }

    if (!selectedPlanId || !selectedStartDate) {
      return;
    }

    const selectedPlan = activePlans.find(
      (plan) => plan.id === selectedPlanId,
    );

    if (!selectedPlan) {
      return;
    }

    form.setValue("amount", selectedPlan.price, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const startDate = new Date(
      `${selectedStartDate}T00:00:00`,
    );

    startDate.setDate(
      startDate.getDate() + selectedPlan.duration_days - 1,
    );

    const endDate = startDate.toISOString().split("T")[0];

    form.setValue("end_date", endDate, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [
    selectedPlanId,
    selectedStartDate,
    isEditMode,
    activePlans,
    form,
  ]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Member */}
      <div className="space-y-2">
        <label
          htmlFor="member_id"
          className="text-sm font-medium"
        >
          Member
        </label>

        <select
          id="member_id"
          disabled={isEditMode || loading}
          {...form.register("member_id")}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ${
            form.formState.errors.member_id
              ? "border-red-500"
              : "border-slate-300"
          }`}
        >
          <option value="">Select member</option>

          {activeMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.member_code} - {member.first_name}
              {member.last_name
                ? ` ${member.last_name}`
                : ""}
            </option>
          ))}
        </select>

        {isEditMode && (
          <p className="text-xs text-slate-500">
            Member cannot be changed after subscription creation.
          </p>
        )}

        {form.formState.errors.member_id && (
          <p className="text-sm text-red-600">
            {form.formState.errors.member_id.message}
          </p>
        )}
      </div>

      {/* Plan */}
      <div className="space-y-2">
        <label
          htmlFor="plan_id"
          className="text-sm font-medium"
        >
          Membership Plan
        </label>

        <select
          id="plan_id"
          disabled={loading}
          {...form.register("plan_id")}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ${
            form.formState.errors.plan_id
              ? "border-red-500"
              : "border-slate-300"
          }`}
        >
          <option value="">Select membership plan</option>

          {activePlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} - ₹{plan.price}
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
        <label
          htmlFor="start_date"
          className="text-sm font-medium"
        >
          Start Date
        </label>

        <input
          id="start_date"
          type="date"
          disabled={loading}
          {...form.register("start_date")}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ${
            form.formState.errors.start_date
              ? "border-red-500"
              : "border-slate-300"
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
        <label
          htmlFor="end_date"
          className="text-sm font-medium"
        >
          End Date
        </label>

        <input
          id="end_date"
          type="date"
          disabled={loading}
          readOnly={!isEditMode}
          {...form.register("end_date")}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
            !isEditMode
              ? "bg-slate-100"
              : "bg-white"
          } ${
            form.formState.errors.end_date
              ? "border-red-500"
              : "border-slate-300"
          }`}
        />

        {!isEditMode && (
          <p className="text-xs text-slate-500">
            Automatically calculated from the selected plan.
          </p>
        )}

        {form.formState.errors.end_date && (
          <p className="text-sm text-red-600">
            {form.formState.errors.end_date.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label
          htmlFor="amount"
          className="text-sm font-medium"
        >
          Amount
        </label>

        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          disabled={loading}
          {...form.register("amount", {
            valueAsNumber: true,
          })}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
            form.formState.errors.amount
              ? "border-red-500"
              : "border-slate-300"
          }`}
        />

        <p className="text-xs text-slate-500">
          This is the amount recorded for this subscription.
        </p>

        {form.formState.errors.amount && (
          <p className="text-sm text-red-600">
            {form.formState.errors.amount.message}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label
          htmlFor="status"
          className="text-sm font-medium"
        >
          Status
        </label>

        <select
          id="status"
          disabled={loading}
          {...form.register("status")}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ${
            form.formState.errors.status
              ? "border-red-500"
              : "border-slate-300"
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
          className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : isEditMode
              ? "Update Subscription"
              : "Create Subscription"}
        </button>
      </div>
    </form>
  );
}