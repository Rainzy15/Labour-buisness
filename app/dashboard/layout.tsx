import { PortalShell, customerNav } from "@/components/portal/PortalShell";
import { requireProfile } from "@/lib/auth/server";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile(["customer", "admin", "manager"]);
  return (
    <PortalShell title="Customer Portal" subtitle="Manage your garden care." profile={profile} nav={customerNav}>
      {children}
    </PortalShell>
  );
}
