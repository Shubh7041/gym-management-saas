import { z } from "zod";

export const membershipPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Plan name is required.")
    .max(100, "Plan name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters.")
    .optional()
    .or(z.literal("")),

  duration_days: z.coerce
    .number()
    .int("Duration must be a whole number.")
    .positive("Duration must be greater than 0."),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0."),

  status: z.enum(["active", "inactive"]),
});

export type MembershipPlanFormValues = z.infer<
  typeof membershipPlanSchema
>;