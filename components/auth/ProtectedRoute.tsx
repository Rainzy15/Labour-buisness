"use client";

import Link from "next/link";
import type { UserRole } from "@/lib/auth/types";
import { useAuth } from "@/components/auth/AuthProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode; allowedRoles?: UserRole[] }) {
  const { user, loading, configured } = useAuth();

  if (loading) {
    return <div className="rounded-[28px] bg-white p-6 text-center font-black text-forest shadow-sm">Loading account...</div>;
  }

  if (!configured) {
    return <SetupRequired />;
  }

  if (!user) {
    return (
      <div className="rounded-[28px] bg-white p-8 text-center shadow-premium">
        <h1 className="text-2xl font-black text-forest">Login required</h1>
        <p className="mt-2 text-charcoal/70">Please log in to access this private area.</p>
        <Link href="/login" className="mt-5 inline-block rounded-full bg-forest px-5 py-3 text-sm font-black text-white">Log in</Link>
      </div>
    );
  }

  return <>{children}</>;
}

function SetupRequired() {
  return (
    <div className="rounded-[28px] bg-white p-8 text-center shadow-premium">
      <h1 className="text-2xl font-black text-forest">Supabase setup required</h1>
      <p className="mt-2 text-charcoal/70">Add Supabase keys to `.env.local` before private portals can authenticate real users.</p>
    </div>
  );
}
