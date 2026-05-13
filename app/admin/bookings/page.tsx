import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockBookings } from "@/lib/mockPlatform";

export default function AdminBookingsPage() {
  return <SimpleTable columns={["id", "customer", "service", "date", "employee", "status", "price"]} rows={mockBookings as any} />;
}
