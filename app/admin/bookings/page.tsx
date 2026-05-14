import Link from "next/link";
import { createBookingAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/portal/PortalShell";
import { getAdminBookingFormData, getAdminBookings } from "@/lib/adminData";

export default async function AdminBookingsPage() {
  const [bookings, formData] = await Promise.all([getAdminBookings(), getAdminBookingFormData()]);

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-forest">Booking management</h2>
        <p className="mt-2 text-sm text-charcoal/70">Create jobs manually, assign employees, update statuses, and delete old bookings when you no longer need them.</p>
      </div>

      <form action={createBookingAction} className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-black text-forest">Create manual job</h3>
        {formData.customers.length === 0 ? (
          <p className="rounded-2xl bg-cream p-4 text-sm font-bold text-forest">Create or onboard a customer first. Manual jobs need a customer record for invoices, history, and privacy rules.</p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Select name="customer_id" label="Customer" required>
                {formData.customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.users_profile?.first_name || "Customer"} {customer.users_profile?.last_name || ""} - {customer.users_profile?.email}
                  </option>
                ))}
              </Select>
              <Select name="address_id" label="Service address">
                <option value="">No address / confirm later</option>
                {formData.addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.label} - {address.street}, {address.commune ?? "Luxembourg"}
                  </option>
                ))}
              </Select>
              <Select name="service_id" label="Service">
                <option value="">Custom / confirm later</option>
                {formData.services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
              </Select>
              <Select name="status" label="Status" defaultValue="scheduled">
                {["requested", "quote_sent", "confirmed", "scheduled", "in_progress", "completed", "cancelled", "rejected"].map((status) => <option key={status} value={status}>{status}</option>)}
              </Select>
              <Input name="requested_date" label="Requested date" type="date" />
              <Input name="scheduled_start" label="Scheduled start" type="datetime-local" />
              <Input name="scheduled_end" label="Scheduled end" type="datetime-local" />
              <Input name="estimated_price" label="Estimated price" type="number" step="0.01" />
              <Input name="final_price" label="Final price" type="number" step="0.01" />
              <Select name="frequency" label="Frequency">
                <option value="one-time">One-time</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
              </Select>
              <Select name="employee_id" label="Assign employee">
                <option value="">Unassigned</option>
                {formData.employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.first_name} {employee.last_name}</option>)}
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Textarea name="customer_notes" label="Customer-facing notes" />
              <Textarea name="internal_notes" label="Internal admin notes" />
            </div>
            <button className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white">Create job</button>
          </>
        )}
      </form>

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

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm font-black text-forest">
      {label}
      <input {...inputProps} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
    </label>
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const { label, children, ...selectProps } = props;
  return (
    <label className="grid gap-2 text-sm font-black text-forest">
      {label}
      <select {...selectProps} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40">
        {children}
      </select>
    </label>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...textareaProps } = props;
  return (
    <label className="grid gap-2 text-sm font-black text-forest">
      {label}
      <textarea {...textareaProps} className="min-h-24 rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
    </label>
  );
}
