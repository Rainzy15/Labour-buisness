import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockInvoices } from "@/lib/mockPlatform";

export default function CustomerInvoicesPage() {
  return <SimpleTable columns={["id", "status", "total", "due"]} rows={mockInvoices.map(({ id, status, total, due }) => ({ id, status, total, due }))} />;
}
