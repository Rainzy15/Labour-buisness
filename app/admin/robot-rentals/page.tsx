import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockRobotRentals } from "@/lib/mockPlatform";

export default function AdminRobotRentalsPage() {
  return <SimpleTable columns={["id", "customer", "plan", "monthly", "status", "deposit"]} rows={mockRobotRentals as any} />;
}
