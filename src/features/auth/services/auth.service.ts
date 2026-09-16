import { supabase } from "@/lib/supabase/client";

import type { LoginCredentials } from "../types/auth.types";

export const authService = {
  async signIn(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    console.log("SIGN IN DATA:", data);
    console.log("SIGN IN ERROR:", error);
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    return user;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new Error(error.message);
    }
  },
};
