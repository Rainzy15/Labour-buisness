import { StatCard } from "@/components/portal/PortalShell";
import { SimpleTable } from "@/components/portal/PlatformTables";
import { mockBookings } from "@/lib/mockPlatform";

export default function AdminPage() {
  const stats = [
    ["Today's bookings", "4", "2 still need confirmation"],
    ["Pending quote requests", "7", "Oldest: 1 day"],
    ["Active contracts", "12", "€2.9k monthly estimate"],
    ["Monthly revenue estimate", "€8.4k", "Projected from active work"],
    ["Open cancellations", "1", "Needs follow-up"],
    ["Employees working today", "3", "Mia, Leo, Noah"],
    ["Robot mowers rented out", "2", "1 request pending"],
    ["Equipment maintenance", "1", "Karcher hose check"]
  ];
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, detail]) => <StatCard key={label} label={label} value={value} detail={detail} />)}
      </div>
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-forest">Live operations snapshot</h2>
        <p className="mt-2 text-sm text-charcoal/70">Charts for bookings by month, revenue by category, and seasonal demand are wired as Phase 2/4 dashboard components.</p>
      </div>
      <SimpleTable columns={["id", "customer", "service", "date", "status", "price"]} rows={mockBookings as any} />
    </div>
  );
}
