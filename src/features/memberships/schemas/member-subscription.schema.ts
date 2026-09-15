import { z } from "zod";

export const memberSubscriptionSchema = z
  .object({
    member_id: z
      .string()
      .uuid("Please select a member."),

    plan_id: z
      .string()
      .uuid("Please select a membership plan."),

    start_date: z
      .string()
      .min(1, "Start date is required."),

    end_date: z
      .string()
      .min(1, "End date is required."),

    amount: z.coerce
      .number()
      .positive("Amount must be greater than 0."),

    status: z.enum([
      "active",
      "expired",
      "cancelled",
    ]),
  })
  .refine(
    (values) => values.end_date >= values.start_date,
    {
      message: "End date cannot be before start date.",
      path: ["end_date"],
    },
  );

export type MemberSubscriptionFormValues = z.infer<
  typeof memberSubscriptionSchema
>;