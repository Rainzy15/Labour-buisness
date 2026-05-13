"use client";

import { useFormState } from "react-dom";
import { createAddressAction, type ActionState } from "@/app/dashboard/actions";

const initialState: ActionState = { ok: false, message: "" };

export function AddressForm() {
  const [state, action] = useFormState(createAddressAction, initialState);

  return (
    <form action={action} className="grid gap-4 rounded-[30px] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-black text-forest">Add service address</h2>
        <p className="mt-1 text-sm text-charcoal/65">Saved addresses make booking faster and help us price access correctly.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="label" label="Label" placeholder="Home" required />
        <Input name="commune" label="Commune" placeholder="Bertrange" required />
        <Input name="street" label="Street" placeholder="12 Rue example" required />
        <Input name="postcode" label="Postcode" placeholder="L-1234" />
        <Input name="city" label="City" placeholder="Luxembourg" />
        <Input name="garden_size_sqm" label="Garden size m²" type="number" placeholder="350" />
      </div>
      <Textarea name="access_notes" label="Access notes" placeholder="Gate code, narrow path, terrace access..." />
      <Textarea name="parking_notes" label="Parking notes" placeholder="Driveway available, street parking, loading spot..." />
      <div className="grid gap-3 md:grid-cols-2">
        <Checkbox name="has_narrow_access" label="Narrow access" />
        <Checkbox name="has_stairs" label="Stairs / complex access" />
        <Checkbox name="has_water_access" label="Water access available" defaultChecked />
        <Checkbox name="is_default" label="Set as default address" />
      </div>
      {state.message && <p className={`rounded-2xl p-3 text-sm font-bold ${state.ok ? "bg-fresh/15 text-forest" : "bg-red-50 text-red-700"}`}>{state.message}</p>}
      <button className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white disabled:opacity-60">
        Save address
      </button>
    </form>
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

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-forest">
      {label}
      <textarea {...props} className="min-h-24 rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
    </label>
  );
}

function Checkbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl bg-cream p-4 text-sm font-black text-forest">
      <input type="checkbox" {...props} /> {label}
    </label>
  );
}
