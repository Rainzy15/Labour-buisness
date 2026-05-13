import Link from "next/link";
import { StatCard } from "@/components/portal/PortalShell";
import { SimpleTable } from "@/components/portal/PlatformTables";
import { getAdminOverviewData } from "@/lib/adminData";

export default async function AdminPage() {
  const { bookings, customers, employees, equipment, robotRentals, contracts, invoices } = await getAdminOverviewData();
  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((booking) => booking.requested_date === today || booking.scheduled_start?.startsWith(today));
  const pending = bookings.filter((booking) => ["requested", "quote_sent"].includes(booking.status));
  const cancellations = bookings.filter((booking) => booking.status === "cancelled");
  const revenue = invoices.reduce((total: number, invoice: any) => total + Number(invoice.total ?? 0), 0);
  const stats = [
    ["Today's bookings", String(todayBookings.length), `${pending.length} still need confirmation`],
    ["Pending quote requests", String(pending.length), pending[0]?.created_at ? `Oldest: ${pending[pending.length - 1]?.created_at.slice(0, 10)}` : "No pending requests"],
    ["Active contracts", String(contracts.filter((contract: any) => contract.status === "active").length), "Recurring care plans"],
    ["Revenue recorded", `€${Math.round(revenue)}`, "From invoice records"],
    ["Open cancellations", String(cancellations.length), "Needs follow-up"],
    ["Employees", String(employees.length), employees.length ? "Ready for assignments" : "Add your first employee"],
    ["Robot rentals", String(robotRentals.length), "Rental pipeline"],
    ["Equipment maintenance", String(equipment.filter((item: any) => item.status === "maintenance").length), "Maintenance queue"]
  ];
  const rows = bookings.slice(0, 6).map((booking) => ({
    id: booking.id.slice(0, 8),
    customer: booking.customers?.users_profile?.email ?? "Unknown",
    service: booking.services?.name ?? "Service",
    date: booking.requested_date ?? booking.created_at.slice(0, 10),
    status: booking.status,
    price: booking.final_price ? `€${booking.final_price}` : booking.estimated_price ? `€${booking.estimated_price}` : "TBC"
  }));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, detail]) => <StatCard key={label} label={label} value={value} detail={detail} />)}
      </div>
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-forest">Live operations snapshot</h2>
        <p className="mt-2 text-sm text-charcoal/70">This dashboard now reads Supabase bookings, customers, employees, contracts, invoices, equipment, and robot rentals.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/bookings" className="rounded-full bg-forest px-4 py-2 text-sm font-black text-white">Manage bookings</Link>
          <Link href="/admin/employees" className="rounded-full bg-lime px-4 py-2 text-sm font-black text-forest">Manage employees</Link>
        </div>
      </div>
      <SimpleTable columns={["id", "customer", "service", "date", "status", "price"]} rows={rows} />
    </div>
  );
}
