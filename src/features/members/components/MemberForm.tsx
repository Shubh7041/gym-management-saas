import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { memberSchema, type MemberFormValues } from "../schemas/member.schema";
import type { Branch } from "@/features/tenanats/types/tenant.types";

interface MemberFormProps {
  branches: Branch[];
  defaultBranchId?: string | null;
  defaultValues?: Partial<MemberFormValues>;
  loading?: boolean;
  isEditMode?: boolean;
  onSubmit: (values: MemberFormValues) => Promise<void>;
  onCancel: () => void;
}

export default function MemberForm({
  branches,
  defaultBranchId,
  defaultValues,
  loading = false,
  isEditMode = false,
  onSubmit,
  onCancel,
}: MemberFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      branch_id: defaultBranchId ?? "",
      member_code: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      gender: undefined,
      address: "",
      join_date: new Date().toISOString().split("T")[0],
      status: "active",

      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultBranchId) {
      setValue("branch_id", defaultBranchId);
    }
  }, [defaultBranchId, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Basic Information</h2>

          <p className="text-sm text-muted-foreground">
            Enter the member's basic details.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Branch */}
          <div className="space-y-2">
            <label htmlFor="branch_id" className="text-sm font-medium">
              Branch
            </label>

            <select
              id="branch_id"
              {...register("branch_id")}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Select branch</option>

              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>

            {errors.branch_id && (
              <p className="text-sm text-destructive">
                {errors.branch_id.message}
              </p>
            )}
          </div>

          {isEditMode && (
            <div className="space-y-2">
              <label htmlFor="member_code" className="text-sm font-medium">
                Member Code
              </label>

              <input
                id="member_code"
                {...register("member_code")}
                readOnly
                className="h-10 w-full rounded-md border bg-muted px-3 text-sm text-muted-foreground"
              />
            </div>
          )}

          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium">
              First Name
            </label>

            <input
              id="first_name"
              {...register("first_name")}
              placeholder="Enter first name"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />

            {errors.first_name && (
              <p className="text-sm text-destructive">
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-medium">
              Last Name
            </label>

            <input
              id="last_name"
              {...register("last_name")}
              placeholder="Enter last name"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />

            {errors.last_name && (
              <p className="text-sm text-destructive">
                {errors.last_name.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>

            <input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="Enter phone number"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />

            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="member@example.com"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />

            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label htmlFor="date_of_birth" className="text-sm font-medium">
              Date of Birth
            </label>

            <input
              id="date_of_birth"
              type="date"
              {...register("date_of_birth")}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />

            {errors.date_of_birth && (
              <p className="text-sm text-destructive">
                {errors.date_of_birth.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Gender
            </label>

            <select
              id="gender"
              {...register("gender")}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Address</h2>

          <p className="text-sm text-muted-foreground">
            Add the member's address if available.
          </p>
        </div>

        <textarea
          {...register("address")}
          placeholder="Enter address"
          rows={4}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />

        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </section>

      {/* Membership Details */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Membership Details</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Join Date */}
          <div className="space-y-2">
            <label htmlFor="join_date" className="text-sm font-medium">
              Join Date
            </label>

            <input
              id="join_date"
              type="date"
              {...register("join_date")}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />

            {errors.join_date && (
              <p className="text-sm text-destructive">
                {errors.join_date.message}
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
              {...register("status")}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </section>

      {/* Actions */}
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
          {loading
            ? isEditMode
              ? "Saving changes..."
              : "Creating member..."
            : isEditMode
              ? "Save Changes"
              : "Create Member"}
        </button>
      </div>
    </form>
  );
}
