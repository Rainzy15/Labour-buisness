import Link from "next/link";
import { notFound } from "next/navigation";
import { assignEmployeeAction, updateBookingAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/portal/PortalShell";
import { getAdminBooking, getAdminEmployees } from "@/lib/adminData";

export default async function AdminBookingDetailPage({ params }: { params: { id: string } }) {
  const [booking, employees] = await Promise.all([getAdminBooking(params.id), getAdminEmployees()]);
  if (!booking) notFound();

  const assigned = booking.job_assignments?.[0]?.employees;

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-fresh">Booking detail</p>
            <h2 className="mt-2 text-3xl font-black text-forest">{booking.services?.name ?? "Service request"}</h2>
            <p className="mt-2 text-sm text-charcoal/70">Customer: {booking.customers?.users_profile?.email ?? "Unknown"}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Info label="Requested date" value={booking.requested_date ?? "Not set"} />
          <Info label="Estimate" value={booking.estimated_price ? `€${booking.estimated_price}` : "TBC"} />
          <Info label="Final price" value={booking.final_price ? `€${booking.final_price}` : "Not set"} />
          <Info label="Address" value={booking.addresses ? `${booking.addresses.street}, ${booking.addresses.commune}` : "No address"} />
          <Info label="Access notes" value={booking.addresses?.access_notes ?? "None"} />
          <Info label="Assigned employee" value={assigned ? `${assigned.first_name} ${assigned.last_name}` : "Unassigned"} />
        </div>
        {booking.customer_notes && <p className="mt-5 rounded-2xl bg-cream p-4 text-sm text-charcoal/75">Customer notes: {booking.customer_notes}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form action={updateBookingAction} className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-black text-forest">Update booking</h3>
          <input type="hidden" name="id" value={booking.id} />
          <label className="grid gap-2 text-sm font-black text-forest">
            Status
            <select name="status" defaultValue={booking.status} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm">
              {["requested", "quote_sent", "confirmed", "scheduled", "in_progress", "completed", "cancelled", "rejected"].map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <Input name="scheduled_start" label="Scheduled start" type="datetime-local" defaultValue={toDateTimeLocal(booking.scheduled_start)} />
          <Input name="scheduled_end" label="Scheduled end" type="datetime-local" defaultValue={toDateTimeLocal(booking.scheduled_end)} />
          <Input name="final_price" label="Final price" type="number" defaultValue={booking.final_price ?? booking.estimated_price ?? ""} />
          <label className="grid gap-2 text-sm font-black text-forest">
            Internal notes
            <textarea name="internal_notes" defaultValue={booking.internal_notes ?? ""} className="min-h-28 rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
          </label>
          <button className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white">Save booking</button>
        </form>

        <form action={assignEmployeeAction} className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-black text-forest">Assign employee</h3>
          <input type="hidden" name="booking_id" value={booking.id} />
          <label className="grid gap-2 text-sm font-black text-forest">
            Employee
            <select name="employee_id" defaultValue={assigned?.id ?? ""} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm">
              <option value="" disabled>Select employee</option>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.first_name} {employee.last_name}</option>)}
            </select>
          </label>
          <button className="rounded-full bg-lime px-5 py-3 text-sm font-black text-forest">Assign to booking</button>
          <Link href="/admin/employees" className="rounded-full bg-cream px-5 py-3 text-center text-sm font-black text-forest">Manage employees</Link>
        </form>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-cream p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-charcoal/50">{label}</p>
      <p className="mt-1 text-sm font-bold text-forest">{value}</p>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm font-black text-forest">
      {label}
      <input {...inputProps} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
    </label>
  );
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  return value.slice(0, 16);
}
