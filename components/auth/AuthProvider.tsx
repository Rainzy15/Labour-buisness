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
    let cancelled = false;

    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    async function loadUser() {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;
      if (cancelled) return;

      setUser(sessionUser);
      setLoading(false);

      if (sessionUser) {
        loadRole(sessionUser.id);
      } else {
        setRole(null);
      }
    }

    async function loadRole(userId: string) {
      const { data: profile } = await supabase.from("users_profile").select("role").eq("auth_user_id", userId).maybeSingle();
      if (!cancelled) setRole((profile?.role as UserRole | undefined) ?? null);
    }

    loadUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setRole(null);
      if (session?.user) {
        loadRole(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [configured]);

  const value = useMemo(() => ({ user, role, loading, configured }), [user, role, loading, configured]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
