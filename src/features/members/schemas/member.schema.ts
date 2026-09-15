import { z } from "zod";

export const memberSchema = z.object({
  branch_id: z.string().uuid("Please select a branch."),

  member_code: z
    .string()
    .trim()
    .max(50, "Member code cannot exceed 50 characters.")
    .optional(),

  first_name: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name cannot exceed 100 characters."),

  last_name: z
    .string()
    .trim()
    .max(100, "Last name cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email cannot exceed 255 characters.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(20, "Phone number cannot exceed 20 characters.")
    .optional()
    .or(z.literal("")),

  date_of_birth: z.string().optional().or(z.literal("")),

  gender: z.enum(["male", "female", "other"]).nullable().optional(),

  address: z
    .string()
    .trim()
    .max(1000, "Address cannot exceed 1000 characters.")
    .optional()
    .or(z.literal("")),

  join_date: z.string().min(1, "Join date is required."),

  status: z.enum(["active", "inactive", "blocked"]),
});

export type MemberFormValues = z.infer<typeof memberSchema>;
