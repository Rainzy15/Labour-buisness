import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockEmployees } from "@/lib/mockPlatform";

export default function AdminEmployeesPage() {
  return <SimpleTable columns={["id", "name", "skills", "status", "jobs", "rating"]} rows={mockEmployees as any} />;
}
