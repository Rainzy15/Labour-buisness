"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { hasSupabaseEnv } from "@/lib/env";
import type { UserRole } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  configured: boolean;
};

const AuthContext = createContext<AuthContextValue>({ user: null, role: null, loading: true, configured: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = hasSupabaseEnv();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      if (data.user) {
        const { data: profile } = await supabase.from("users_profile").select("role").eq("auth_user_id", data.user.id).maybeSingle();
        setRole((profile?.role as UserRole | undefined) ?? null);
      } else {
        setRole(null);
      }
      setLoading(false);
    }

    loadUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setRole(null);
      if (session?.user) {
        supabase
          .from("users_profile")
          .select("role")
          .eq("auth_user_id", session.user.id)
          .maybeSingle()
          .then(({ data: profile }) => setRole((profile?.role as UserRole | undefined) ?? null));
      }
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, [configured]);

  const value = useMemo(() => ({ user, role, loading, configured }), [user, role, loading, configured]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
