import Link from "next/link";
import { getAdminCustomers } from "@/lib/adminData";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="grid gap-4">
      {customers.length === 0 && <p className="rounded-[28px] bg-white p-6 text-sm font-bold text-charcoal/70 shadow-sm">No customers yet.</p>}
      {customers.map((customer) => {
        const lifetime = customer.bookings?.reduce((total, booking) => total + Number(booking.final_price ?? booking.estimated_price ?? 0), 0) ?? 0;
        return (
          <Link key={customer.id} href={`/admin/customers/${customer.id}`} className="block rounded-[28px] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
            <h2 className="text-2xl font-black text-forest">{customer.users_profile?.first_name || "Customer"} {customer.users_profile?.last_name || ""}</h2>
            <div className="mt-3 grid gap-2 text-sm text-charcoal/70 md:grid-cols-4">
              <p>{customer.users_profile?.email}</p>
              <p>{customer.addresses?.[0]?.commune ?? "No address"}</p>
              <p>{customer.bookings?.length ?? 0} bookings</p>
              <p>Lifetime estimate: €{Math.round(lifetime)}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
