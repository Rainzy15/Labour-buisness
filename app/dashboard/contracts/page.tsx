import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockContracts } from "@/lib/mockPlatform";

export default function CustomerContractsPage() {
  return <SimpleTable columns={["id", "title", "status", "value"]} rows={mockContracts.map(({ id, title, status, value }) => ({ id, title, status, value }))} />;
}
