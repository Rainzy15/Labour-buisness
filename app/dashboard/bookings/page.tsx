import Link from "next/link";
import { cancelBookingAction } from "@/app/dashboard/actions";
import { StatusBadge } from "@/components/portal/PortalShell";
import { requireProfile } from "@/lib/auth/server";
import { getCustomerDashboardData, type BookingRecord } from "@/lib/dashboardData";

export default async function CustomerBookingsPage() {
  const profile = await requireProfile(["customer", "admin", "manager"]);
  const { bookings } = await getCustomerDashboardData(profile);
  const upcoming = bookings.filter((booking) => booking.status !== "completed");

  return (
    <div className="grid gap-4">
      {upcoming.length === 0 && (
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-forest">No bookings yet</h2>
          <p className="mt-2 text-sm text-charcoal/70">Request a service and it will appear here.</p>
          <Link href="/dashboard/book" className="mt-4 inline-block rounded-full bg-forest px-5 py-3 text-sm font-black text-white">Book service</Link>
        </div>
      )}
      {upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
    </div>
  );
}

function BookingCard({ booking }: { booking: BookingRecord }) {
  const scheduled = booking.scheduled_start ? new Date(booking.scheduled_start) : null;
  const canCancel = !scheduled || scheduled.getTime() - Date.now() > 24 * 60 * 60 * 1000;

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-forest">{booking.services?.name ?? "Service request"}</h2>
          <p className="mt-1 text-sm font-bold text-charcoal/70">{booking.addresses?.label ?? "Address"} · {booking.requested_date ?? "Date requested"}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-charcoal/70 md:grid-cols-3">
        <p>Estimate: €{booking.estimated_price ?? "TBC"}</p>
        <p>Final: {booking.final_price ? `€${booking.final_price}` : "Confirmed before work"}</p>
        <p>Frequency: {booking.frequency ?? "one-time"}</p>
      </div>
      {booking.customer_notes && <p className="mt-3 rounded-2xl bg-cream p-3 text-sm text-charcoal/70">{booking.customer_notes}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {canCancel ? (
          <form action={cancelBookingAction} className="flex gap-2">
            <input type="hidden" name="id" value={booking.id} />
            <input type="hidden" name="cancellation_reason" value="Cancelled by customer from dashboard" />
            <button className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">Cancel appointment</button>
          </form>
        ) : (
          <p className="rounded-full bg-cream px-4 py-2 text-sm font-bold text-forest">Within 24 hours. Please contact us directly to cancel or reschedule.</p>
        )}
        <Link href="/dashboard/support" className="rounded-full bg-forest px-4 py-2 text-sm font-black text-white">Request reschedule</Link>
      </div>
    </div>
  );
}
