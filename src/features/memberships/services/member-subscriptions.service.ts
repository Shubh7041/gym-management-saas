import { supabase } from "@/lib/supabase/client";

import type {
  CreateMemberSubscriptionInput,
  MemberSubscription,
  UpdateMemberSubscriptionInput,
} from "../types/member-subscription.types";

const MEMBER_SUBSCRIPTIONS_TABLE = "member_subscriptions";

export const memberSubscriptionsService = {
  async getSubscriptions(): Promise<MemberSubscription[]> {
    const { data, error } = await supabase
      .from(MEMBER_SUBSCRIPTIONS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  },

  async getSubscriptionById(id: string): Promise<MemberSubscription> {
    const { data, error } = await supabase
      .from(MEMBER_SUBSCRIPTIONS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getSubscriptionsByMember(
    memberId: string,
  ): Promise<MemberSubscription[]> {
    const { data, error } = await supabase
      .from(MEMBER_SUBSCRIPTIONS_TABLE)
      .select("*")
      .eq("member_id", memberId)
      .order("start_date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  },

  async checkSubscriptionOverlap(
    memberId: string,
    startDate: string,
    endDate: string,
    excludeSubscriptionId?: string,
  ): Promise<boolean> {
    const { data, error } = await supabase.rpc("check_subscription_overlap", {
      p_member_id: memberId,
      p_start_date: startDate,
      p_end_date: endDate,
      p_exclude_subscription_id: excludeSubscriptionId ?? null,
    });
    console.log("OVERLAP CHECK INPUT:", {
      memberId,
      startDate,
      endDate,
      excludeSubscriptionId,
    });

    console.log("OVERLAP CHECK RESULT:", {
      data,
      error,
    });

    if (error) {
      console.error("OVERLAP RPC ERROR:", error);
      throw new Error(error.message);
    }

    return Boolean(data);
  },

  async createSubscription(
    input: CreateMemberSubscriptionInput,
  ): Promise<MemberSubscription> {
    const { data, error } = await supabase
      .from(MEMBER_SUBSCRIPTIONS_TABLE)
      .insert(input)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateSubscription(
    id: string,
    input: UpdateMemberSubscriptionInput,
  ): Promise<MemberSubscription> {
    const { data, error } = await supabase
      .from(MEMBER_SUBSCRIPTIONS_TABLE)
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
