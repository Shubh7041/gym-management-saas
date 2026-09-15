import { supabase } from "@/lib/supabase/client";

import type {
  CreateMembershipPlanInput,
  MembershipPlan,
  UpdateMembershipPlanInput,
} from "../types/membership-plan.types";

const MEMBERSHIP_PLANS_TABLE = "membership_plans";

export const membershipPlansService = {
  async getPlans(): Promise<MembershipPlan[]> {
    const { data, error } = await supabase
      .from(MEMBERSHIP_PLANS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  },

  async getPlanById(id: string): Promise<MembershipPlan> {
    const { data, error } = await supabase
      .from(MEMBERSHIP_PLANS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async createPlan(
    input: CreateMembershipPlanInput,
  ): Promise<MembershipPlan> {
    const { data, error } = await supabase
      .from(MEMBERSHIP_PLANS_TABLE)
      .insert(input)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updatePlan(
    id: string,
    input: UpdateMembershipPlanInput,
  ): Promise<MembershipPlan> {
    const { data, error } = await supabase
      .from(MEMBERSHIP_PLANS_TABLE)
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};