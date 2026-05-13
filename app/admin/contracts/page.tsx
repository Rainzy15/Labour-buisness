import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockContracts } from "@/lib/mockPlatform";

export default function AdminContractsPage() {
  return <SimpleTable columns={["id", "customer", "title", "status", "value"]} rows={mockContracts as any} />;
}
