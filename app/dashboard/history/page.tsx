import Link from "next/link";
import { StatusBadge } from "@/components/portal/PortalShell";
import { requireProfile } from "@/lib/auth/server";
import { getCustomerDashboardData } from "@/lib/dashboardData";

export default async function CustomerHistoryPage() {
  const profile = await requireProfile(["customer", "admin", "manager"]);
  const { bookings } = await getCustomerDashboardData(profile);
  const completed = bookings.filter((booking) => booking.status === "completed");

  return (
    <div className="grid gap-4">
      {completed.length === 0 && <p className="rounded-[28px] bg-white p-6 text-sm font-bold text-charcoal/70 shadow-sm">Completed services will appear here after jobs are closed.</p>}
      {completed.map((booking) => (
        <div key={booking.id} className="rounded-[28px] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-forest">{booking.services?.name ?? "Service"}</h2>
              <p className="mt-1 text-sm text-charcoal/70">{booking.scheduled_start ?? booking.requested_date}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          <p className="mt-3 text-sm text-charcoal/70">Final price: {booking.final_price ? `€${booking.final_price}` : "TBC"}</p>
          <Link href="/dashboard/book" className="mt-4 inline-block rounded-full bg-lime px-4 py-2 text-sm font-black text-forest">Book again</Link>
        </div>
      ))}
    </div>
  );
}
