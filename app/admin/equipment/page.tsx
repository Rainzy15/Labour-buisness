import { createEquipmentAction, deleteEquipmentAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/portal/PortalShell";
import { getAdminEquipment } from "@/lib/adminData";

export default async function AdminEquipmentPage() {
  const equipment = await getAdminEquipment();

  return (
    <div className="grid gap-6">
      <form action={createEquipmentAction} className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-forest">Add equipment</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="name" label="Name" required />
          <Input name="type" label="Type" placeholder="lawn_mower, pressure_washer..." required />
          <Input name="brand" label="Brand" />
          <Input name="model" label="Model" />
          <Input name="serial_number" label="Serial number" />
          <Input name="purchase_price" label="Purchase price" type="number" step="0.01" />
          <Input name="purchase_date" label="Purchase date" type="date" />
          <Select name="status" label="Status" defaultValue="available">
            <option value="available">available</option>
            <option value="in_use">in use</option>
            <option value="maintenance">maintenance</option>
            <option value="retired">retired</option>
          </Select>
        </div>
        <Textarea name="notes" label="Maintenance notes" />
        <button className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white">Create equipment</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {equipment.length === 0 && <p className="rounded-[28px] bg-white p-6 text-sm font-bold text-charcoal/70 shadow-sm">No equipment yet.</p>}
        {equipment.map((item) => (
          <div key={item.id} className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-forest">{item.name}</h3>
                <p className="mt-1 text-sm text-charcoal/70">{item.brand ?? "No brand"} {item.model ?? ""} · {item.type}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="mt-4 grid gap-2 text-sm text-charcoal/70">
              <p>Serial: {item.serial_number ?? "Not set"}</p>
              <p>Purchase: {item.purchase_price ? `€${item.purchase_price}` : "Not set"} {item.purchase_date ? `on ${item.purchase_date}` : ""}</p>
              <p>Notes: {item.notes ?? "No notes"}</p>
            </div>
            <form action={deleteEquipmentAction} className="mt-4">
              <input type="hidden" name="id" value={item.id} />
              <button className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">Delete equipment</button>
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
