import { deleteAddressAction } from "@/app/dashboard/actions";
import { AddressForm } from "@/components/dashboard/AddressForm";
import { StatusBadge } from "@/components/portal/PortalShell";
import { requireProfile } from "@/lib/auth/server";
import { getCustomerDashboardData } from "@/lib/dashboardData";

export default async function CustomerAddressesPage() {
  const profile = await requireProfile(["customer", "admin", "manager"]);
  const { addresses } = await getCustomerDashboardData(profile);

  return (
    <div className="grid gap-6">
      <AddressForm />
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.length === 0 && <Empty text="No addresses saved yet." />}
        {addresses.map((address) => (
          <div key={address.id} className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-forest">{address.label}</h2>
                <p className="mt-1 text-sm font-bold text-charcoal/70">{address.street}, {address.commune}</p>
              </div>
              {address.is_default && <StatusBadge status="default" />}
            </div>
            <div className="mt-4 grid gap-2 text-sm text-charcoal/70">
              <p>Garden size: {address.garden_size_sqm ?? "Unknown"} m²</p>
              <p>Water access: {address.has_water_access ? "Yes" : "No"}</p>
              <p>Access: {address.has_narrow_access ? "Narrow access" : "Standard"} {address.has_stairs ? "· Stairs" : ""}</p>
              {address.access_notes && <p>Notes: {address.access_notes}</p>}
            </div>
            <form action={deleteAddressAction} className="mt-4">
              <input type="hidden" name="id" value={address.id} />
              <button className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">Delete address</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-[28px] bg-white p-6 text-sm font-bold text-charcoal/70 shadow-sm">{text}</p>;
}
