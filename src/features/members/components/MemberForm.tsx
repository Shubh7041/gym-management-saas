import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  MapPin,
  User,
  Users,
} from "lucide-react";

import {
  memberSchema,
  type MemberFormValues,
} from "../schemas/member.schema";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Personal Information                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={User}
          title="Personal Information"
          description="Enter the member's basic personal details."
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {/* Branch */}
          <FormField
            label="Branch"
            htmlFor="branch_id"
            required
            error={errors.branch_id?.message}
          >
            <select
              id="branch_id"
              disabled={loading}
              {...register("branch_id")}
              className={inputClass(
                Boolean(errors.branch_id),
              )}
            >
              <option value="">Select branch</option>

              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </FormField>

          {/* Member Code */}
          {isEditMode && (
            <FormField
              label="Member Code"
              htmlFor="member_code"
            >
              <input
                id="member_code"
                {...register("member_code")}
                readOnly
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-mono text-slate-500 outline-none"
              />
            </FormField>
          )}

          {/* First Name */}
          <FormField
            label="First Name"
            htmlFor="first_name"
            required
            error={errors.first_name?.message}
          >
            <input
              id="first_name"
              {...register("first_name")}
              disabled={loading}
              placeholder="Enter first name"
              className={inputClass(
                Boolean(errors.first_name),
              )}
            />
          </FormField>

          {/* Last Name */}
          <FormField
            label="Last Name"
            htmlFor="last_name"
            error={errors.last_name?.message}
          >
            <input
              id="last_name"
              {...register("last_name")}
              disabled={loading}
              placeholder="Enter last name"
              className={inputClass(
                Boolean(errors.last_name),
              )}
            />
          </FormField>

          {/* Phone */}
          <FormField
            label="Phone"
            htmlFor="phone"
            required
            error={errors.phone?.message}
          >
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              disabled={loading}
              placeholder="Enter phone number"
              className={inputClass(
                Boolean(errors.phone),
              )}
            />
          </FormField>

          {/* Email */}
          <FormField
            label="Email"
            htmlFor="email"
            error={errors.email?.message}
          >
            <input
              id="email"
              type="email"
              {...register("email")}
              disabled={loading}
              placeholder="member@example.com"
              className={inputClass(
                Boolean(errors.email),
              )}
            />
          </FormField>

          {/* Date of Birth */}
          <FormField
            label="Date of Birth"
            htmlFor="date_of_birth"
            error={errors.date_of_birth?.message}
          >
            <input
              id="date_of_birth"
              type="date"
              {...register("date_of_birth")}
              disabled={loading}
              className={inputClass(
                Boolean(errors.date_of_birth),
              )}
            />
          </FormField>

          {/* Gender */}
          <FormField
            label="Gender"
            htmlFor="gender"
            error={errors.gender?.message}
          >
            <select
              id="gender"
              {...register("gender")}
              disabled={loading}
              className={inputClass(
                Boolean(errors.gender),
              )}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </FormField>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Address                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={MapPin}
          title="Address"
          description="Add the member's residential address."
        />

        <div className="mt-6">
          <FormField
            label="Address"
            htmlFor="address"
            error={errors.address?.message}
          >
            <textarea
              id="address"
              {...register("address")}
              disabled={loading}
              placeholder="Enter complete address"
              rows={4}
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </FormField>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Membership Details                                                  */}
      {/* ------------------------------------------------------------------ */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={Users}
          title="Membership Details"
          description="Set the member's joining date and account status."
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {/* Join Date */}
          <FormField
            label="Join Date"
            htmlFor="join_date"
            required
            error={errors.join_date?.message}
          >
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="join_date"
                type="date"
                {...register("join_date")}
                disabled={loading}
                className={`${inputClass(
                  Boolean(errors.join_date),
                )} pl-10`}
              />
            </div>
          </FormField>

          {/* Status */}
          <FormField
            label="Status"
            htmlFor="status"
            required
            error={errors.status?.message}
          >
            <select
              id="status"
              {...register("status")}
              disabled={loading}
              className={inputClass(
                Boolean(errors.status),
              )}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </FormField>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Actions                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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

/* -------------------------------------------------------------------------- */
/* Reusable UI                                                                */
/* -------------------------------------------------------------------------- */

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-0.5 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900",
    "outline-none transition-all",
    "placeholder:text-slate-400",
    "focus:ring-2 focus:ring-primary/10",
    "disabled:cursor-not-allowed disabled:bg-slate-50",
    hasError
      ? "border-red-300 focus:border-red-500"
      : "border-slate-200 focus:border-primary",
  ].join(" ");
}