import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  membershipPlanSchema,
  type MembershipPlanFormValues,
} from "../schemas/membership-plan.schema";
import { useEffect } from "react";

interface MembershipPlanFormProps {
  defaultValues?: Partial<MembershipPlanFormValues>;
  loading?: boolean;
  onSubmit: (values: MembershipPlanFormValues) => Promise<void>;
  onCancel: () => void;
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Plan Name <span className="text-destructive">*</span>
          </label>

          <input
            id="name"
            {...register("name")}
            placeholder="Monthly"
            className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.name ? "border-destructive focus:ring-destructive/20" : ""
            }`}
          />

          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="duration_days" className="text-sm font-medium">
            Duration in Days <span className="text-destructive">*</span>
          </label>

          <input
            id="duration_days"
            type="number"
            min="1"
            {...register("duration_days", {
              valueAsNumber: true,
            })}
            className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.duration_days
                ? "border-destructive focus:ring-destructive/20"
                : ""
            }`}
          />

          {errors.duration_days && (
            <p className="text-sm text-destructive">
              {errors.duration_days.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Price <span className="text-destructive">*</span>
          </label>

          <input
            id="price"
            type="number"
            min="1"
            step="0.01"
            {...register("price", {
              valueAsNumber: true,
            })}
            className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.price ? "border-destructive focus:ring-destructive/20" : ""
            }`}
          />

          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>

          <select
            id="status"
            {...register("status")}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>

        <textarea
          id="description"
          {...register("description")}
          placeholder="Describe this membership plan"
          rows={4}
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${
            errors.description
              ? "border-destructive focus:ring-destructive/20"
              : ""
          }`}
        />

        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-10 rounded-md border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating plan..." : "Create Plan"}
        </button>
      </div>
    </form>
  );
}
