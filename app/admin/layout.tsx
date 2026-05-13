import { PortalShell, adminNav } from "@/components/portal/PortalShell";
import { requireProfile } from "@/lib/auth/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile(["admin", "manager"]);
  return (
    <PortalShell title="Admin Dashboard" subtitle="Business operations center." profile={profile} nav={adminNav}>
      {children}
    </PortalShell>
  );
}
