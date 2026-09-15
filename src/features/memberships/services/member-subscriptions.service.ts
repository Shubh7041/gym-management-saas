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

  async getSubscriptionById(
    id: string,
  ): Promise<MemberSubscription> {
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