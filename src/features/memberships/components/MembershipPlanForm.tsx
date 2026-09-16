import { useEffect } from "react";
import { CalendarDays, IndianRupee, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  membershipPlanSchema,
  type MembershipPlanFormValues,
} from "../schemas/membership-plan.schema";

interface MembershipPlanFormProps {
  defaultValues?: Partial<MembershipPlanFormValues>;
  loading?: boolean;
  onSubmit: (values: MembershipPlanFormValues) => Promise<void>;
  onCancel: () => void;
}

const inputClass = (hasError = false) =>
  [
    "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900",
    "outline-none transition-all",
    "placeholder:text-slate-400",
    "focus:border-primary focus:ring-4 focus:ring-primary/10",
    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
      : "border-slate-200 hover:border-slate-300",
  ].join(" ");

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function MembershipPlanForm({
  defaultValues,
  loading = false,
  onSubmit,
  onCancel,
}: MembershipPlanFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MembershipPlanFormValues>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      duration_days: 30,
      price: 1500,
      status: "active",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
        duration_days: defaultValues.duration_days ?? 30,
        price: defaultValues.price ?? 1500,
        status: defaultValues.status ?? "active",
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/* Basic Plan Information                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="space-y-5">
        <SectionHeader
          icon={<Sparkles className="h-4 w-4" />}
          title="Plan Information"
          description="Set the basic details of your membership plan."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Plan Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700"
            >
              Plan Name <span className="text-red-500">*</span>
            </label>

            <input
              id="name"
              disabled={loading}
              {...register("name")}
              placeholder="e.g. Monthly"
              className={inputClass(Boolean(errors.name))}
            />

            {errors.name && (
              <p className="text-xs font-medium text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label
              htmlFor="duration_days"
              className="text-sm font-medium text-slate-700"
            >
              Duration in Days{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="duration_days"
                type="number"
                min="1"
                disabled={loading}
                {...register("duration_days", {
                  valueAsNumber: true,
                })}
                className={`${inputClass(
                  Boolean(errors.duration_days),
                )} pl-10 pr-16`}
              />

              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                days
              </span>
            </div>

            {errors.duration_days && (
              <p className="text-xs font-medium text-red-600">
                {errors.duration_days.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="text-sm font-medium text-slate-700"
            >
              Price <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <IndianRupee className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="price"
                type="number"
                min="1"
                step="0.01"
                disabled={loading}
                {...register("price", {
                  valueAsNumber: true,
                })}
                className={`${inputClass(
                  Boolean(errors.price),
                )} pl-10`}
              />
            </div>

            {errors.price && (
              <p className="text-xs font-medium text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label
              htmlFor="status"
              className="text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              disabled={loading}
              {...register("status")}
              className={`${inputClass()} cursor-pointer`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <p className="text-xs text-slate-500">
              Inactive plans cannot be selected for new
              subscriptions.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Description                                                         */}
      {/* ------------------------------------------------------------------ */}

      <section className="space-y-5 border-t border-slate-100 pt-7">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Description
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Add an optional description to help staff understand
            this plan.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700"
          >
            Plan Description
          </label>

          <textarea
            id="description"
            disabled={loading}
            {...register("description")}
            placeholder="Describe this membership plan..."
            rows={4}
            className={`${inputClass(
              Boolean(errors.description),
            )} h-auto resize-y py-3`}
          />

          {errors.description && (
            <p className="text-xs font-medium text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Actions                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Plan"}
        </button>
      </div>
    </form>
  );
}