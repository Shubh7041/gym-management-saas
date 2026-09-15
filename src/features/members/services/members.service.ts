import { supabase } from "@/lib/supabase/client";
import type {
  CreateMemberInput,
  Member,
  UpdateMemberInput,
} from "../types/member.types";

const MEMBERS_TABLE = "members";

export const membersService = {
  async getMembers(): Promise<Member[]> {
    const { data, error } = await supabase
      .from(MEMBERS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  },

  async getMemberById(id: string): Promise<Member> {
    const { data, error } = await supabase
      .from(MEMBERS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async createMember(input: CreateMemberInput): Promise<Member> {
    const { data, error } = await supabase
      .from(MEMBERS_TABLE)
      .insert(input)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateMember(id: string, input: UpdateMemberInput): Promise<Member> {
    const { data, error } = await supabase
      .from(MEMBERS_TABLE)
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deleteMember(id: string): Promise<void> {
    const { error } = await supabase.from(MEMBERS_TABLE).delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },

  async generateMemberCode(tenantId: string): Promise<string> {
    const { data, error } = await supabase.rpc("generate_member_code", {
      p_tenant_id: tenantId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};
