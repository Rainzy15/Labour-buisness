"use client";

import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { createBookingAction, type ActionState } from "@/app/dashboard/actions";
import type { AddressRecord, ServiceRecord } from "@/lib/dashboardData";

const initialState: ActionState = { ok: false, message: "" };

export function BookingRequestForm({ addresses, services }: { addresses: AddressRecord[]; services: ServiceRecord[] }) {
  const [state, action] = useFormState(createBookingAction, initialState);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? "");
  const [surface, setSurface] = useState(250);
  const selectedService = useMemo(() => services.find((service) => service.id === selectedServiceId), [services, selectedServiceId]);
  const estimated = useMemo(() => {
    const base = Number(selectedService?.base_price ?? 55);
    if (selectedService?.category === "lawn") return Math.max(55, surface * 0.25);
    if (selectedService?.category === "pressure") return Math.max(85, surface * 12);
    if (selectedService?.category === "leaves") return Math.max(50, surface * 0.22);
    return base;
  }, [selectedService, surface]);

  if (addresses.length === 0) {
    return (
      <div className="rounded-[30px] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-forest">Add an address first</h2>
        <p className="mt-2 text-sm leading-6 text-charcoal/70">You need a saved service address before sending a booking request. Add one on the Addresses page, then come back here.</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 rounded-[30px] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-black text-forest">Request a booking</h2>
        <p className="mt-1 text-sm text-charcoal/65">Requests are not auto-confirmed. Admin will confirm date, final quote, and assignment.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-forest">
          Service
          <select name="service_id" value={selectedServiceId} onChange={(event) => setSelectedServiceId(event.target.value)} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm">
            {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black text-forest">
          Address
          <select name="address_id" className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm">
            {addresses.map((address) => <option key={address.id} value={address.id}>{address.label} - {address.commune}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black text-forest">
          Preferred date
          <input name="requested_date" type="date" required className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-black text-forest">
          Preferred time
          <input name="preferred_time" type="time" className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2 text-sm font-black text-forest">
          Frequency
          <select name="frequency" className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm">
            <option value="one-time">One-time</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black text-forest">
          Surface estimate m²
          <input value={surface} onChange={(event) => setSurface(Number(event.target.value))} type="number" min={1} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm" />
        </label>
      </div>
      <input type="hidden" name="estimated_price" value={Math.round(estimated)} />
      <textarea name="customer_notes" placeholder="Tell us anything important about access, grass length, timing, pets, parking, or waste." className="min-h-28 rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
      <div className="rounded-[24px] bg-cream p-5">
        <p className="text-sm font-bold text-charcoal/60">Estimated starting price</p>
        <p className="text-4xl font-black text-forest">€{Math.round(estimated)}</p>
        <p className="mt-1 text-sm text-charcoal/65">Final quote is confirmed before work.</p>
      </div>
      {state.message && <p className={`rounded-2xl p-3 text-sm font-bold ${state.ok ? "bg-fresh/15 text-forest" : "bg-red-50 text-red-700"}`}>{state.message}</p>}
      <button className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white disabled:opacity-60">
        Submit booking request
      </button>
    </form>
  );
}
