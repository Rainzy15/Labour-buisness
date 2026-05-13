import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockInvoices } from "@/lib/mockPlatform";

export default function AdminInvoicesPage() {
  return <SimpleTable columns={["id", "customer", "status", "total", "due"]} rows={mockInvoices as any} />;
}
