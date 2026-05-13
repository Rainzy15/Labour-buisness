import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockEquipment } from "@/lib/mockPlatform";

export default function AdminEquipmentPage() {
  return <SimpleTable columns={["name", "type", "status", "note"]} rows={mockEquipment as any} />;
}
