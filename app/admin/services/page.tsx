import { createServiceAction, deleteServiceAction, restoreDefaultServicesAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/portal/PortalShell";
import { getAdminServices } from "@/lib/adminData";

export default async function AdminServicesPage() {
  const services = await getAdminServices(true);

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] bg-forest p-6 text-white shadow-premium">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Restore LuxLawn default services</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Adds back any missing default services used by the booking builder, including grass care, hedges, leaves, pressure washing, winter work, and hourly garden maintenance. Existing services are kept.
            </p>
          </div>
          <form action={restoreDefaultServicesAction}>
            <button className="rounded-full bg-lime px-5 py-3 text-sm font-black text-forest">Restore missing services</button>
          </form>
        </div>
      </div>

      <form action={createServiceAction} className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-forest">Add service</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="name" label="Name" required />
          <Input name="category" label="Category" placeholder="lawn, hedge, pressure..." required />
          <Input name="season" label="Season" placeholder="Spring, Summer, Autumn, Winter" />
          <Input name="base_price" label="Base price" type="number" step="0.01" />
          <Input name="pricing_unit" label="Pricing unit" placeholder="visit, hour, m², job" />
        </div>
        <Textarea name="description" label="Description" />
        <label className="flex gap-3 rounded-2xl bg-cream p-4 text-sm font-bold text-forest">
          <input type="checkbox" name="active" defaultChecked /> Active and visible for booking
        </label>
        <button className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white">Create service</button>
      </form>

      <div className="grid gap-4">
        {services.length === 0 && <p className="rounded-[28px] bg-white p-6 text-sm font-bold text-charcoal/70 shadow-sm">No services yet.</p>}
        {services.map((service) => (
          <div key={service.id} className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-forest">{service.name}</h3>
                <p className="mt-1 text-sm text-charcoal/70">{service.category} · {service.season ?? "All year"} · €{service.base_price ?? 0}/{service.pricing_unit ?? "unit"}</p>
                {service.description && <p className="mt-3 text-sm leading-6 text-charcoal/70">{service.description}</p>}
              </div>
              <StatusBadge status={service.active ? "active" : "inactive"} />
            </div>
            <form action={deleteServiceAction} className="mt-4">
              <input type="hidden" name="id" value={service.id} />
              <button className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">Delete service</button>
            </form>
          </div>
        ))}
      </div>
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

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...textareaProps } = props;
  return (
    <label className="grid gap-2 text-sm font-black text-forest">
      {label}
      <textarea {...textareaProps} className="min-h-24 rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
    </label>
  );
}
