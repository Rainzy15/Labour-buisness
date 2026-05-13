import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockCustomers } from "@/lib/mockPlatform";

export default function AdminCustomersPage() {
  return <SimpleTable columns={["id", "name", "commune", "lifetime", "flag"]} rows={mockCustomers as any} />;
}
