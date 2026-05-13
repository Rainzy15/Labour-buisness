import Link from "next/link";
import { BookingRequestForm } from "@/components/dashboard/BookingRequestForm";
import { requireProfile } from "@/lib/auth/server";
import { getCustomerDashboardData } from "@/lib/dashboardData";

export default async function CustomerBookPage() {
  const profile = await requireProfile(["customer", "admin", "manager"]);
  const { addresses, services } = await getCustomerDashboardData(profile);

  return (
    <div className="grid gap-5">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-black text-forest">Book a service</h2>
        <p className="mt-2 text-sm leading-7 text-charcoal/70">Choose a service, saved address, preferred date, and notes. Your booking is created as requested and must be confirmed by admin.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/pricing" className="rounded-full bg-lime px-4 py-2 text-sm font-black text-forest">Use full pricing calculator</Link>
          <Link href="/dashboard/addresses" className="rounded-full bg-forest px-4 py-2 text-sm font-black text-white">Manage addresses</Link>
        </div>
      </div>
      <BookingRequestForm addresses={addresses} services={services} />
    </div>
  );
}
