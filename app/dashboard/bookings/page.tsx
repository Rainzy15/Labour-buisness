import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockBookings } from "@/lib/mockPlatform";

export default function CustomerBookingsPage() {
  return <SimpleTable columns={["id", "service", "date", "status", "price"]} rows={mockBookings.map(({ id, service, date, status, price }) => ({ id, service, date, status, price }))} />;
}
