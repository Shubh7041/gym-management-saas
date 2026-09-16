import { useEffect, useMemo, useState, type ReactNode } from "react";

import { supabase } from "@/lib/supabase/client";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      console.log("SUPABASE CLIENT:", supabase);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("INITIAL SESSION:", session);
      if (isMounted) {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AUTH EVENT:", event);
      console.log("AUTH SESSION:", session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
