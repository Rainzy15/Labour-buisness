import { SimpleTable } from "@/components/portal/PlatformTables";

export default function CustomerContractsPage() {
  return <SimpleTable columns={["id", "title", "status", "value"]} rows={[]} />;
}
