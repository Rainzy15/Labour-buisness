import Link from "next/link";
import { CalendarDays, FileText, Leaf, Wrench } from "lucide-react";
import { StatCard } from "@/components/portal/PortalShell";
import { requireProfile } from "@/lib/auth/server";
import { getCustomerDashboardData } from "@/lib/dashboardData";

export default async function DashboardPage() {
  const profile = await requireProfile(["customer", "admin", "manager"]);
  const { bookings, addresses } = await getCustomerDashboardData(profile);
  const upcoming = bookings.filter((booking) => !["completed", "cancelled", "rejected"].includes(booking.status));
  const completed = bookings.filter((booking) => booking.status === "completed");

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Upcoming appointments" value={String(upcoming.length)} detail={upcoming[0]?.requested_date ? `Next request: ${upcoming[0].requested_date}` : "No upcoming request yet"} />
        <StatCard label="Saved addresses" value={String(addresses.length)} detail={addresses[0]?.commune ?? "Add your first address"} />
        <StatCard label="Completed services" value={String(completed.length)} detail="Service history builds here" />
        <StatCard label="Recommended" value="Seasonal care" detail="Use pricing to find best bundle" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          ["/dashboard/book", "Book new service", CalendarDays],
          ["/dashboard/bookings", "View bookings", FileText],
          ["/dashboard/robot-rental", "Rent robot mower", Wrench],
          ["/dashboard/support", "Contact support", Leaf]
        ].map(([href, label, Icon]: any) => (
          <Link key={href} href={href} className="rounded-[26px] bg-white p-6 font-black text-forest shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
            <Icon className="mb-4 h-7 w-7 text-fresh" /> {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
