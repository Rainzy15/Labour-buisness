import type { UserRole } from "@/lib/auth/types";

export function RoleGate({ role, allowed, children }: { role: UserRole; allowed: UserRole[]; children: React.ReactNode }) {
  if (!allowed.includes(role)) {
    return (
      <div className="rounded-[28px] bg-white p-8 text-center shadow-premium">
        <h1 className="text-2xl font-black text-forest">Access restricted</h1>
        <p className="mt-2 text-charcoal/70">This area is not available for your account role.</p>
      </div>
    );
  }

  return <>{children}</>;
}
