import Link from "next/link";
import { StatusBadge } from "@/components/portal/PortalShell";
import { getAdminBookings } from "@/lib/adminData";

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  return (
    <div className="grid gap-4">
      <div className="rounded-[28px] bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-forest">Booking management</h2>
        <p className="mt-2 text-sm text-charcoal/70">Filter/search UI comes next; this live list already opens booking detail pages and shows assignments.</p>
      </div>
      {bookings.length === 0 && <p className="rounded-[28px] bg-white p-6 text-sm font-bold text-charcoal/70 shadow-sm">No bookings yet. Customer requests will appear here.</p>}
      {bookings.map((booking) => (
        <Link key={booking.id} href={`/admin/bookings/${booking.id}`} className="block rounded-[28px] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-forest">{booking.services?.name ?? "Service request"}</h3>
              <p className="mt-1 text-sm font-bold text-charcoal/70">{booking.customers?.users_profile?.email ?? "Unknown customer"} · {booking.requested_date ?? booking.created_at.slice(0, 10)}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          <div className="mt-4 grid gap-2 text-sm text-charcoal/70 md:grid-cols-4">
            <p>Estimate: {booking.estimated_price ? `€${booking.estimated_price}` : "TBC"}</p>
            <p>Final: {booking.final_price ? `€${booking.final_price}` : "Not set"}</p>
            <p>Employee: {booking.job_assignments?.[0]?.employees ? `${booking.job_assignments[0].employees.first_name} ${booking.job_assignments[0].employees.last_name}` : "Unassigned"}</p>
            <p>Address: {booking.addresses?.commune ?? "No address"}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
