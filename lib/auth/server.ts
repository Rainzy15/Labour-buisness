import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserRole } from "@/lib/auth/types";

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.from("users_profile").select("*").eq("auth_user_id", user.id).single();
  return data as UserProfile | null;
}

export async function requireProfile(allowedRoles?: UserRole[]) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    redirect(profile.role === "customer" ? "/dashboard" : profile.role === "employee" ? "/employee" : "/admin");
  }

  return profile;
}
