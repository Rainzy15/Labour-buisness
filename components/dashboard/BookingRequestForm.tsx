"use client";

import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { CalendarDays, CheckCircle2, Clock, Leaf, Plus, Scissors, Snowflake, Sprout, Trash2, Waves } from "lucide-react";
import { createMultiServiceBookingAction, type ActionState } from "@/app/dashboard/actions";
import type { AddressRecord, ServiceRecord } from "@/lib/dashboardData";
import { PRICING, eur } from "@/lib/pricing";

const initialState: ActionState = { ok: false, message: "" };

type BookingServiceCategory = "lawn" | "hedge" | "leaves" | "pressure" | "winter" | "hourly" | "general";

type DraftOptions = {
  quantity: number;
  frequency: "one-time" | "weekly" | "biweekly" | "monthly";
  difficulty: "easy" | "normal" | "difficult";
  addWaste: boolean;
  addEdges: boolean;
  workers: 1 | 2;
};

type QuoteItem = {
  serviceId: string;
  serviceName: string;
  category: BookingServiceCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  details: DraftOptions & { description?: string | null };
};

const categoryMeta: Record<BookingServiceCategory, { label: string; unit: string; min: number; max: number; helper: string; icon: React.ComponentType<{ className?: string }> }> = {
  lawn: { label: "Lawn size", unit: "m²", min: 50, max: 1500, helper: "Use the area of the lawn that needs mowing.", icon: Sprout },
  hedge: { label: "Hedge length", unit: "linear m", min: 1, max: 120, helper: "Measure the total visible hedge run.", icon: Scissors },
  leaves: { label: "Leaf area", unit: "m²", min: 50, max: 2000, helper: "Include lawn, paths, beds, and terrace areas.", icon: Leaf },
  pressure: { label: "Surface area", unit: "m²", min: 10, max: 300, helper: "Terrace, driveway, path, or lower facade area.", icon: Waves },
  winter: { label: "Winter surface", unit: "m²", min: 10, max: 500, helper: "Paths, driveway, steps, and entrance areas.", icon: Snowflake },
  hourly: { label: "Hours", unit: "h", min: 1, max: 8, helper: "Two-hour minimum applies for hourly work.", icon: Clock },
  general: { label: "Quantity", unit: "item", min: 1, max: 20, helper: "Use this for simple request items.", icon: CalendarDays }
};

export function BookingRequestForm({ addresses, services }: { addresses: AddressRecord[]; services: ServiceRecord[] }) {
  const [state, action] = useFormState(createMultiServiceBookingAction, initialState);
  const visibleServices = useMemo(() => services.filter((service) => service.category !== "robot"), [services]);
  const [selectedServiceId, setSelectedServiceId] = useState(visibleServices[0]?.id ?? "");
  const [options, setOptions] = useState<DraftOptions>({
    quantity: 250,
    frequency: "one-time",
    difficulty: "normal",
    addWaste: false,
    addEdges: true,
    workers: 1
  });
  const [basket, setBasket] = useState<QuoteItem[]>([]);

  const selectedService = useMemo(
    () => visibleServices.find((service) => service.id === selectedServiceId) ?? visibleServices[0],
    [selectedServiceId, visibleServices]
  );
  const category = getCategory(selectedService?.category);
  const meta = categoryMeta[category];
  const estimate = useMemo(() => selectedService ? estimateService(selectedService, category, options) : null, [selectedService, category, options]);
  const total = basket.reduce((sum, item) => sum + item.subtotal, 0);
  const monthly = basket.reduce((sum, item) => sum + recurringMonthly(item), 0);

  function chooseService(service: ServiceRecord) {
    const nextCategory = getCategory(service.category);
    const nextMeta = categoryMeta[nextCategory];
    setSelectedServiceId(service.id);
    setOptions((current) => ({
      ...current,
      quantity: Math.min(Math.max(defaultQuantity(nextCategory), nextMeta.min), nextMeta.max),
      addEdges: nextCategory === "lawn",
      workers: nextCategory === "hourly" ? current.workers : 1
    }));
  }

  function addCurrentService() {
    if (!selectedService || !estimate) return;
    setBasket((items) => [
      ...items,
      {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        category,
        quantity: options.quantity,
        unit: meta.unit,
        unitPrice: estimate.unitPrice,
        subtotal: estimate.total,
        details: { ...options, description: selectedService.description }
      }
    ]);
  }

  if (addresses.length === 0) {
    return (
      <div className="rounded-[30px] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-forest">Add an address first</h2>
        <p className="mt-2 text-sm leading-6 text-charcoal/70">You need a saved service address before sending a booking request. Add one on the Addresses page, then come back here.</p>
      </div>
    );
  }

  if (visibleServices.length === 0) {
    return (
      <div className="rounded-[30px] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-forest">No services are active yet</h2>
        <p className="mt-2 text-sm leading-6 text-charcoal/70">Add active services in the admin panel first, then customers can build booking requests here.</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-5">
          <section className="rounded-[30px] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-fresh">Step 1</p>
              <h2 className="mt-1 text-2xl font-black text-forest">Choose services</h2>
              <p className="mt-1 text-sm leading-6 text-charcoal/65">Pick a service, adjust the details, then add it to your booking. You can combine several services in one request.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleServices.map((service) => {
                const serviceCategory = getCategory(service.category);
                const Icon = categoryMeta[serviceCategory].icon;
                const active = service.id === selectedService?.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => chooseService(service)}
                    className={`min-h-[150px] rounded-[24px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-glass ${
                      active ? "border-fresh bg-forest text-white shadow-premium" : "border-forest/10 bg-cream/60 text-forest"
                    }`}
                  >
                    <span className={`mb-3 grid h-11 w-11 place-items-center rounded-2xl ${active ? "bg-lime text-forest" : "bg-white text-forest"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="block text-base font-black">{service.name}</span>
                    <span className={`mt-1 line-clamp-2 block text-xs leading-5 ${active ? "text-white/72" : "text-charcoal/60"}`}>{service.description ?? "Seasonal garden care service."}</span>
                    <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${active ? "bg-white/12 text-white" : "bg-white text-forest"}`}>
                      from {eur(Number(service.base_price ?? estimateMinimum(serviceCategory)))}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[30px] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-fresh">Step 2</p>
                <h2 className="mt-1 text-2xl font-black text-forest">Customize estimate</h2>
                <p className="mt-1 text-sm text-charcoal/65">{meta.helper}</p>
              </div>
              <div className="rounded-[22px] bg-cream px-4 py-3 text-right">
                <p className="text-xs font-bold text-charcoal/55">Current estimate</p>
                <p className="text-2xl font-black text-forest">{estimate ? eur(estimate.total) : "€0"}</p>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[24px] border border-forest/10 bg-cream p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <label htmlFor="booking-quantity" className="text-sm font-black text-forest">{meta.label}</label>
                  <span className="rounded-full bg-lime px-3 py-1 text-sm font-black text-forest">{options.quantity} {meta.unit}</span>
                </div>
                <input
                  id="booking-quantity"
                  type="range"
                  min={meta.min}
                  max={meta.max}
                  value={options.quantity}
                  onChange={(event) => setOptions({ ...options, quantity: Number(event.target.value) })}
                  className="h-3 w-full cursor-pointer appearance-none rounded-full"
                  style={{ background: sliderFill(options.quantity, meta.min, meta.max) }}
                />
                <div className="mt-2 flex justify-between text-xs font-bold text-charcoal/45">
                  <span>{meta.min} {meta.unit}</span>
                  <span>{meta.max} {meta.unit}</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-black text-forest">
                  Frequency
                  <select value={options.frequency} onChange={(event) => setOptions({ ...options, frequency: event.target.value as DraftOptions["frequency"] })} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm">
                    <option value="one-time">One-time</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Biweekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-black text-forest">
                  Difficulty / condition
                  <select value={options.difficulty} onChange={(event) => setOptions({ ...options, difficulty: event.target.value as DraftOptions["difficulty"] })} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm">
                    <option value="easy">Easy / light</option>
                    <option value="normal">Normal</option>
                    <option value="difficult">Difficult / heavy</option>
                  </select>
                </label>
                {category === "hourly" && (
                  <label className="grid gap-2 text-sm font-black text-forest">
                    Workers
                    <select value={options.workers} onChange={(event) => setOptions({ ...options, workers: Number(event.target.value) as 1 | 2 })} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm">
                      <option value={1}>1 worker</option>
                      <option value={2}>2 workers</option>
                    </select>
                  </label>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ToggleButton active={options.addWaste} onClick={() => setOptions({ ...options, addWaste: !options.addWaste })} label="Green waste removal" />
                <ToggleButton active={options.addEdges} onClick={() => setOptions({ ...options, addEdges: !options.addEdges })} label={category === "lawn" ? "Edge trimming" : "Extra finishing"} />
              </div>

              <div className="grid gap-3 rounded-[24px] bg-forest p-4 text-white sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-black">{selectedService?.name}</p>
                  <p className="mt-1 text-xs leading-5 text-white/70">
                    {options.quantity} {meta.unit} · {options.frequency} · {options.difficulty}
                  </p>
                </div>
                <button type="button" onClick={addCurrentService} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-black text-forest">
                  <Plus className="h-4 w-4" /> Add service
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-24 xl:self-start">
          <section className="rounded-[30px] bg-forest p-5 text-white shadow-premium sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-lime">Booking basket</p>
                <h2 className="mt-1 text-2xl font-black">Selected services</h2>
              </div>
              <span className="rounded-full bg-lime px-3 py-1 text-sm font-black text-forest">{basket.length}</span>
            </div>
            <div className="mt-5 grid gap-3">
              {basket.length === 0 ? (
                <p className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/70">Add one or more services. Your request will be sent as one booking with separate service lines.</p>
              ) : (
                basket.map((item, index) => (
                  <div key={`${item.serviceId}-${index}`} className="flex items-start justify-between gap-3 rounded-2xl bg-white/10 p-3">
                    <div>
                      <p className="text-sm font-black">{item.serviceName}</p>
                      <p className="mt-1 text-xs text-white/65">{item.quantity} {item.unit} · {item.details.frequency}</p>
                      <p className="mt-1 text-sm font-black text-lime">{eur(item.subtotal)}</p>
                    </div>
                    <button type="button" aria-label={`Remove ${item.serviceName}`} onClick={() => setBasket((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full bg-white/10 p-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="mt-5 grid gap-2 border-t border-white/15 pt-4 text-sm">
              <div className="flex justify-between gap-3"><span className="text-white/65">Estimated booking total</span><strong>{eur(total)}</strong></div>
              <div className="flex justify-between gap-3"><span className="text-white/65">Monthly if recurring</span><strong>{eur(monthly)}</strong></div>
            </div>
          </section>
        </aside>
      </div>

      <section className="rounded-[30px] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-fresh">Step 3</p>
          <h2 className="mt-1 text-2xl font-black text-forest">Visit details</h2>
          <p className="mt-1 text-sm text-charcoal/65">Admin will confirm the final price, route, and exact appointment time before work starts.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
            Main frequency
            <select name="frequency" className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm">
              <option value="multi-service">Multi-service request</option>
              <option value="one-time">One-time</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
        </div>
        <textarea name="customer_notes" placeholder="Tell us about access, parking, pets, gates, photos, timing, or anything that may affect the work." className="mt-4 min-h-28 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
        <input type="hidden" name="estimated_price" value={Math.round(total)} />
        <input type="hidden" name="quote_items_json" value={JSON.stringify(basket)} />
        {state.message && <p className={`mt-4 rounded-2xl p-3 text-sm font-bold ${state.ok ? "bg-fresh/15 text-forest" : "bg-red-50 text-red-700"}`}>{state.message}</p>}
        {basket.length === 0 && <p className="mt-4 rounded-2xl bg-cream p-3 text-sm font-bold text-forest">Add at least one service before submitting.</p>}
        <button disabled={basket.length === 0} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto">
          Submit multi-service booking request
        </button>
      </section>
    </form>
  );
}

function ToggleButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className={`flex min-h-12 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${active ? "border-fresh bg-fresh/12 text-forest" : "border-forest/10 bg-cream text-charcoal/70"}`}>
      <span>{label}</span>
      <CheckCircle2 className={`h-5 w-5 ${active ? "text-fresh" : "text-forest/20"}`} />
    </button>
  );
}

function getCategory(category?: string | null): BookingServiceCategory {
  if (category === "lawn") return "lawn";
  if (category === "hedge") return "hedge";
  if (category === "leaves") return "leaves";
  if (category === "pressure") return "pressure";
  if (category === "winter") return "winter";
  if (category === "hourly") return "hourly";
  return "general";
}

function defaultQuantity(category: BookingServiceCategory) {
  if (category === "lawn") return 250;
  if (category === "hedge") return 18;
  if (category === "leaves") return 300;
  if (category === "pressure") return 35;
  if (category === "winter") return 60;
  if (category === "hourly") return 2;
  return 1;
}

function estimateMinimum(category: BookingServiceCategory) {
  if (category === "lawn") return PRICING.lawn.minimumVisit;
  if (category === "hedge") return PRICING.hedge.minimumJob;
  if (category === "leaves") return PRICING.leaves.minimumVisit;
  if (category === "pressure") return PRICING.pressureWashing.minimumJob;
  if (category === "winter") return PRICING.winter.combinedMinimum;
  if (category === "hourly") return PRICING.hourly.hourlyRatePerWorker * PRICING.hourly.minimumHours;
  return 25;
}

function estimateService(service: ServiceRecord, category: BookingServiceCategory, options: DraftOptions) {
  const difficultyMultiplier = options.difficulty === "easy" ? 0.95 : options.difficulty === "difficult" ? 1.25 : 1;
  const recurringDiscount = options.frequency === "weekly" ? 0.15 : options.frequency === "biweekly" ? 0.1 : options.frequency === "monthly" ? 0.05 : 0;
  let unitPrice = Number(service.base_price ?? estimateMinimum(category));
  let total = unitPrice;

  if (category === "lawn") {
    unitPrice = PRICING.lawn.basePerSqm;
    total = Math.max(options.quantity * unitPrice * difficultyMultiplier, PRICING.lawn.minimumVisit);
    if (options.addEdges) total += PRICING.lawn.edgeTrimming;
    if (options.addWaste) total += options.quantity > 500 ? PRICING.lawn.greenWasteRemovalLarge : PRICING.lawn.greenWasteRemovalSmall;
  } else if (category === "hedge") {
    unitPrice = PRICING.hedge.basePerLinearMeter;
    total = Math.max(options.quantity * unitPrice * difficultyMultiplier, PRICING.hedge.minimumJob);
    if (options.addWaste) total += PRICING.hedge.wasteRemoval;
  } else if (category === "leaves") {
    unitPrice = PRICING.leaves.basePerSqm;
    total = Math.max(options.quantity * unitPrice * difficultyMultiplier, PRICING.leaves.minimumVisit);
    if (options.addWaste) total += options.quantity > 600 ? PRICING.leaves.takeAwayFeeLarge : PRICING.leaves.takeAwayFeeSmall;
  } else if (category === "pressure") {
    unitPrice = PRICING.pressureWashing.basePerSqm;
    total = Math.max(options.quantity * unitPrice * difficultyMultiplier, PRICING.pressureWashing.minimumJob);
  } else if (category === "winter") {
    unitPrice = PRICING.winter.snowPerSqm + PRICING.winter.saltingPerSqm;
    total = Math.max(options.quantity * unitPrice * difficultyMultiplier, PRICING.winter.combinedMinimum);
  } else if (category === "hourly") {
    const hours = Math.max(options.quantity, PRICING.hourly.minimumHours);
    unitPrice = PRICING.hourly.hourlyRatePerWorker;
    total = hours * options.workers * unitPrice;
    if (options.addWaste) total += PRICING.hourly.wasteRemoval;
  } else {
    unitPrice = Number(service.base_price ?? 25);
    total = unitPrice * options.quantity * difficultyMultiplier;
    if (options.addWaste) total += 15;
  }

  total -= total * recurringDiscount;
  return { unitPrice, total: Math.max(0, Math.round(total)) };
}

function recurringMonthly(item: QuoteItem) {
  if (item.details.frequency === "weekly") return item.subtotal * 4;
  if (item.details.frequency === "biweekly") return item.subtotal * 2;
  if (item.details.frequency === "monthly") return item.subtotal;
  return 0;
}

function sliderFill(value: number, min: number, max: number) {
  const percentage = ((value - min) / (max - min)) * 100;
  return `linear-gradient(90deg, #5DBB63 ${percentage}%, rgba(18,61,42,.12) ${percentage}%)`;
}
