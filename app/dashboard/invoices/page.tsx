import { SimpleTable } from "@/components/portal/PlatformTables";

export default function CustomerInvoicesPage() {
  return <SimpleTable columns={["id", "status", "total", "due"]} rows={[]} />;
}
