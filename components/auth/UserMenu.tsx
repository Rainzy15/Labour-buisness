"use client";

import Link from "next/link";
import { LogOut, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export function UserMenu() {
  const { user, configured } = useAuth();

  async function logout() {
    if (!configured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!configured || !user) {
    return (
      <Link href="/login" className="rounded-full bg-forest px-4 py-2 text-sm font-extrabold text-white transition hover:bg-charcoal">
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-black text-forest">
        <UserCircle className="h-4 w-4" /> Account
      </Link>
      <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-full bg-forest text-white" aria-label="Logout">
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
