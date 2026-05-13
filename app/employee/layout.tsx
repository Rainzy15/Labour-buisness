import { PortalShell, employeeNav } from "@/components/portal/PortalShell";
import { requireProfile } from "@/lib/auth/server";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile(["employee", "admin", "manager"]);
  return (
    <PortalShell title="Employee Portal" subtitle="Today's field work." profile={profile} nav={employeeNav}>
      {children}
    </PortalShell>
  );
}
