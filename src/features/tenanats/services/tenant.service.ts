import { supabase } from "@/lib/supabase/client";
import type { Branch, Tenant } from "../types/tenant.types";

export const tenantService = {
  async getCurrentTenant(): Promise<Tenant> {
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    const authUser = authData.user;

    if (!authUser) {
      throw new Error("Authenticated user not found.");
    }

    // Step 1: Find the public.users profile using auth_user_id
    const {
      data: userProfile,
      error: userProfileError,
    } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", authUser.id)
      .single();

    if (userProfileError) {
      throw new Error(
        `Unable to find public user profile: ${userProfileError.message}`,
      );
    }

    // Step 2: Find the tenant connected to public.users.id
    const {
      data: tenantUser,
      error: tenantUserError,
    } = await supabase
      .from("tenant_users")
      .select(
        `
          tenant_id,
          tenants (
            id,
            name,
            slug,
            email,
            phone,
            address,
            status,
            created_at,
            updated_at
          )
        `,
      )
      .eq("user_id", userProfile.id)
      .eq("status", "active")
      .limit(1)
      .single();

    if (tenantUserError) {
      throw new Error(
        `Unable to find tenant membership: ${tenantUserError.message}`,
      );
    }

    if (!tenantUser?.tenants) {
      throw new Error("No active tenant found for this user.");
    }

    return tenantUser.tenants as unknown as Tenant;
  },

  async getBranches(tenantId: string): Promise<Branch[]> {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("status", "active")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  },
};