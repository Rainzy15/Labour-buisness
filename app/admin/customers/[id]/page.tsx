import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/portal/PortalShell";
import { getAdminCustomer } from "@/lib/adminData";

export default async function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await getAdminCustomer(params.id);
  if (!customer) notFound();
  const lifetime = customer.bookings?.reduce((total, booking) => total + Number(booking.final_price ?? booking.estimated_price ?? 0), 0) ?? 0;

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-black text-forest">{customer.users_profile?.first_name || "Customer"} {customer.users_profile?.last_name || ""}</h2>
        <p className="mt-2 text-sm text-charcoal/70">{customer.users_profile?.email} · {customer.users_profile?.phone ?? "No phone"}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Info label="Bookings" value={String(customer.bookings?.length ?? 0)} />
          <Info label="Lifetime estimate" value={`€${Math.round(lifetime)}`} />
          <Info label="Marketing consent" value={customer.marketing_consent ? "Yes" : "No"} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(customer.addresses ?? []).map((address) => (
          <div key={address.id} className="rounded-[28px] bg-white p-5 shadow-sm">
            <h3 className="text-xl font-black text-forest">{address.label}</h3>
            <p className="mt-2 text-sm text-charcoal/70">{address.street}, {address.commune}</p>
            <p className="mt-1 text-sm text-charcoal/70">Garden: {address.garden_size_sqm ?? "Unknown"} m²</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3">
        {(customer.bookings ?? []).map((booking) => (
          <Link key={booking.id} href={`/admin/bookings/${booking.id}`} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <span className="font-bold text-forest">{booking.id.slice(0, 8)}</span>
            <StatusBadge status={booking.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-cream p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-charcoal/50">{label}</p><p className="mt-1 text-lg font-black text-forest">{value}</p></div>;
}
