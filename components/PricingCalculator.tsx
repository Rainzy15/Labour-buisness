"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Leaf, Scissors, Snowflake, Sprout, Waves } from "lucide-react";
import {
  calculateHedge,
  calculateHourly,
  calculateLawn,
  calculateLeaves,
  calculatePressure,
  calculateWinter,
  Estimate
} from "@/lib/pricing";
import { Select, Toggle } from "@/components/ui";
import {
  LiveEstimateCard,
  MobileStickyEstimateBar,
  PremiumSlider,
  QuoteBasket,
  ServiceTabCard
} from "@/components/pricing/PricingUi";

type Tab = "lawn" | "hedges" | "leaves" | "pressure" | "winter" | "hourly";
type LawnState = Parameters<typeof calculateLawn>[0];
type HedgeState = Parameters<typeof calculateHedge>[0];
type LeavesState = Parameters<typeof calculateLeaves>[0];
type PressureState = Parameters<typeof calculatePressure>[0];
type WinterState = Parameters<typeof calculateWinter>[0];
type HourlyState = Parameters<typeof calculateHourly>[0];

const tabs: Array<{ id: Tab; label: string; price: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "lawn", label: "Lawn", price: "from €27.50", icon: Sprout },
  { id: "hedges", label: "Hedges", price: "from €32.50", icon: Scissors },
  { id: "leaves", label: "Leaves", price: "from €25", icon: Leaf },
  { id: "pressure", label: "Pressure", price: "from €42.50", icon: Waves },
  { id: "winter", label: "Winter", price: "from €69.50/mo", icon: Snowflake },
  { id: "hourly", label: "Hourly", price: "from €27.50/h", icon: Clock }
];

export function PricingCalculator({ initialTab = "lawn" }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [basket, setBasket] = useState<Estimate[]>([]);
  const [lawn, setLawn] = useState<LawnState>({ size: 350, season: "summer", frequency: "biweekly", grass: "normal", edge: true, collection: false, waste: false, terrain: "easy", access: "easy", travel: "near", care: "standard" });
  const [hedge, setHedge] = useState<HedgeState>({ length: 18, height: "from150to250cm", density: "normal", shaping: "clean", waste: true, access: "easy" });
  const [leaves, setLeaves] = useState<LeavesState>({ area: 300, density: "medium", removal: "bags", frequency: "oneTime" });
  const [pressure, setPressure] = useState<PressureState>({ area: 35, surface: "terrace", dirt: "normalDirt", treatment: false, water: "available", drainage: "easy" });
  const [winter, setWinter] = useState<WinterState>({ area: 60, service: "combined", timing: "planned", property: "driveway", contract: "standby" });
  const [hourly, setHourly] = useState<HourlyState>({ hours: 2, workers: 1, service: "weeding", waste: false, materials: false });

  const estimate = useMemo(() => {
    if (tab === "lawn") return calculateLawn(lawn);
    if (tab === "hedges") return calculateHedge(hedge);
    if (tab === "leaves") return calculateLeaves(leaves);
    if (tab === "pressure") return calculatePressure(pressure);
    if (tab === "winter") return calculateWinter(winter);
    return calculateHourly(hourly);
  }, [tab, lawn, hedge, leaves, pressure, winter, hourly]);

  function addEstimate() {
    setBasket((items) => [...items, { ...estimate, id: `${estimate.id}-${Date.now()}` }]);
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_410px]">
        <div className="min-w-0">
          <div className="mb-5 flex gap-3 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]">
            {tabs.map((item) => (
              <ServiceTabCard key={item.id} active={tab === item.id} icon={item.icon} label={item.label} price={item.price} onClick={() => setTab(item.id)} />
            ))}
          </div>
          <div className="rounded-[26px] bg-white p-4 shadow-premium sm:rounded-[34px] sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }} className="grid gap-5">
                {tab === "lawn" && <LawnControls lawn={lawn} setLawn={setLawn} />}
                {tab === "hedges" && <HedgeControls hedge={hedge} setHedge={setHedge} />}
                {tab === "leaves" && <LeafControls leaves={leaves} setLeaves={setLeaves} />}
                {tab === "pressure" && <PressureControls pressure={pressure} setPressure={setPressure} />}
                {tab === "winter" && <WinterControls winter={winter} setWinter={setWinter} />}
                {tab === "hourly" && <HourlyControls hourly={hourly} setHourly={setHourly} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <LiveEstimateCard estimate={estimate} onAdd={addEstimate} />
          <div className="mt-5">
            <QuoteBasket items={basket} onRemove={(index) => setBasket((items) => items.filter((_, itemIndex) => itemIndex !== index))} />
          </div>
        </aside>
      </div>
      <div className="mt-6 lg:hidden">
        <QuoteBasket items={basket} onRemove={(index) => setBasket((items) => items.filter((_, itemIndex) => itemIndex !== index))} />
      </div>
      <MobileStickyEstimateBar estimate={estimate} onAdd={addEstimate} />
    </>
  );
}

function LawnControls({ lawn, setLawn }: { lawn: LawnState; setLawn: (value: LawnState) => void }) {
  return (
    <>
      <PremiumSlider label="Lawn size" value={lawn.size} min={50} max={1500} suffix="m²" helper={lawn.size < 150 ? "Small city garden" : lawn.size < 400 ? "Typical residential garden" : lawn.size < 800 ? "Large family garden" : "Large property"} onChange={(size) => setLawn({ ...lawn, size })} />
      <Grid>
        <Choice label="Season" value={lawn.season ?? "summer"} onChange={(season) => setLawn({ ...lawn, season })} options={[["spring", "Spring first cut"], ["summer", "Summer"], ["autumn", "Autumn"]]} />
        <Choice label="Care level" value={lawn.care} onChange={(care) => setLawn({ ...lawn, care })} options={[["basic", "Basic mowing"], ["standard", "Standard care"], ["premium", "Premium care"]]} />
        <Choice label="Visit frequency" value={lawn.frequency} onChange={(frequency) => setLawn({ ...lawn, frequency })} options={[["oneTime", "One-time"], ["weekly", "Weekly"], ["biweekly", "Biweekly"], ["monthly", "Monthly"]]} />
        <Choice label="Grass condition" value={lawn.grass} onChange={(grass) => setLawn({ ...lawn, grass })} options={[["normal", "Normal"], ["long", "Long"], ["overgrown", "Overgrown"], ["wet", "Wet"]]} />
        <Choice label="Terrain" value={lawn.terrain} onChange={(terrain) => setLawn({ ...lawn, terrain })} options={[["easy", "Easy"], ["medium", "Medium"], ["difficult", "Difficult"]]} />
        <Choice label="Access" value={lawn.access} onChange={(access) => setLawn({ ...lawn, access })} options={[["easy", "Easy"], ["narrow", "Narrow access"], ["complex", "Stairs/complex"]]} />
        <Choice label="Travel distance" value={lawn.travel} onChange={(travel) => setLawn({ ...lawn, travel })} options={[["near", "Within 10km"], ["mid", "10-25km"], ["far", "25km+"]]} />
      </Grid>
      <ToggleGrid>
        <Toggle checked={lawn.edge} onChange={(edge) => setLawn({ ...lawn, edge })} label="Edge trimming" />
        <Toggle checked={lawn.collection} onChange={(collection) => setLawn({ ...lawn, collection })} label="Grass collection" />
        <Toggle checked={lawn.waste} onChange={(waste) => setLawn({ ...lawn, waste })} label="Green waste removal" />
      </ToggleGrid>
    </>
  );
}

function HedgeControls({ hedge, setHedge }: { hedge: HedgeState; setHedge: (value: HedgeState) => void }) {
  return (
    <>
      <PremiumSlider label="Hedge length" value={hedge.length} min={1} max={120} suffix="m" helper="Measure the visible hedge run in linear metres." onChange={(length) => setHedge({ ...hedge, length })} />
      <Grid>
        <Choice label="Height" value={hedge.height} onChange={(height) => setHedge({ ...hedge, height })} options={[["under150cm", "Under 1.5m"], ["from150to250cm", "1.5-2.5m"], ["over250cm", "Over 2.5m"]]} />
        <Choice label="Density" value={hedge.density} onChange={(density) => setHedge({ ...hedge, density })} options={[["light", "Light"], ["normal", "Normal"], ["dense", "Dense"]]} />
        <Choice label="Shape precision" value={hedge.shaping} onChange={(shaping) => setHedge({ ...hedge, shaping })} options={[["basic", "Basic trim"], ["clean", "Clean shaping"], ["premium", "Premium shaping"]]} />
        <Choice label="Access" value={hedge.access} onChange={(access) => setHedge({ ...hedge, access })} options={[["easy", "Easy"], ["complex", "Complex / ladder work"]]} />
      </Grid>
      <Toggle checked={hedge.waste} onChange={(waste) => setHedge({ ...hedge, waste })} label="Green waste removal" />
    </>
  );
}

function LeafControls({ leaves, setLeaves }: { leaves: LeavesState; setLeaves: (value: LeavesState) => void }) {
  return (
    <>
      <PremiumSlider label="Leaf area" value={leaves.area} min={50} max={2000} suffix="m²" helper="Estimate lawn, paths, terrace, and garden areas covered by leaves." onChange={(area) => setLeaves({ ...leaves, area })} />
      <Grid>
        <Choice label="Leaf density" value={leaves.density} onChange={(density) => setLeaves({ ...leaves, density })} options={[["light", "Light"], ["medium", "Medium"], ["heavy", "Heavy"]]} />
        <Choice label="Waste handling" value={leaves.removal} onChange={(removal) => setLeaves({ ...leaves, removal })} options={[["bags", "Leave in bags"], ["takeAway", "Take away green waste"], ["compost", "Compost pile on property"]]} />
        <Choice label="Visit plan" value={leaves.frequency} onChange={(frequency) => setLeaves({ ...leaves, frequency })} options={[["oneTime", "One-time"], ["threeVisits", "3-visit autumn plan"], ["fiveVisits", "5-visit autumn plan"]]} />
      </Grid>
    </>
  );
}

function PressureControls({ pressure, setPressure }: { pressure: PressureState; setPressure: (value: PressureState) => void }) {
  return (
    <>
      <PremiumSlider label="Surface area" value={pressure.area} min={10} max={300} suffix="m²" helper="Terraces, driveways, paths, and lower facade sections." onChange={(area) => setPressure({ ...pressure, area })} />
      <Grid>
        <Choice label="Surface type" value={pressure.surface} onChange={(surface) => setPressure({ ...pressure, surface })} options={[["terrace", "Terrace"], ["driveway", "Driveway"], ["stonePath", "Stone path"], ["facadeLower", "Facade lower section"]]} />
        <Choice label="Dirt level" value={pressure.dirt} onChange={(dirt) => setPressure({ ...pressure, dirt })} options={[["lightDirt", "Light dirt"], ["normalDirt", "Normal"], ["heavyMoss", "Heavy moss/algae"]]} />
        <Choice label="Water access" value={pressure.water} onChange={(water) => setPressure({ ...pressure, water })} options={[["available", "Available"], ["notAvailable", "Not available"]]} />
        <Choice label="Drainage" value={pressure.drainage} onChange={(drainage) => setPressure({ ...pressure, drainage })} options={[["easy", "Easy"], ["limited", "Limited drainage"]]} />
      </Grid>
      <Toggle checked={pressure.treatment} onChange={(treatment) => setPressure({ ...pressure, treatment })} label="Protective treatment" />
    </>
  );
}

function WinterControls({ winter, setWinter }: { winter: WinterState; setWinter: (value: WinterState) => void }) {
  return (
    <>
      <PremiumSlider label="Winter surface area" value={winter.area} min={10} max={500} suffix="m²" helper="Paths, driveways, residence entrances, and small business access." onChange={(area) => setWinter({ ...winter, area })} />
      <Grid>
        <Choice label="Service type" value={winter.service} onChange={(service) => setWinter({ ...winter, service })} options={[["snow", "Snow clearing only"], ["salting", "Salting only"], ["combined", "Snow clearing + salting"]]} />
        <Choice label="Urgency" value={winter.timing} onChange={(timing) => setWinter({ ...winter, timing })} options={[["planned", "Planned"], ["sameDay", "Same day"], ["emergency", "Emergency early morning"]]} />
        <Choice label="Property type" value={winter.property} onChange={(property) => setWinter({ ...winter, property })} options={[["pathway", "Pathway"], ["driveway", "Driveway"], ["residence", "Residence entrance"], ["business", "Small business entrance"]]} />
        <Choice label="Contract type" value={winter.contract} onChange={(contract) => setWinter({ ...winter, contract })} options={[["oneTime", "One-time visit"], ["standby", "Monthly standby"]]} />
      </Grid>
    </>
  );
}

function HourlyControls({ hourly, setHourly }: { hourly: HourlyState; setHourly: (value: HourlyState) => void }) {
  return (
    <>
      <PremiumSlider label="Hours" value={hourly.hours} min={1} max={8} suffix="h" helper="Two-hour minimum booking applies." onChange={(hours) => setHourly({ ...hourly, hours })} />
      <Grid>
        <Choice label="Workers" value={String(hourly.workers)} onChange={(workers) => setHourly({ ...hourly, workers: Number(workers) as 1 | 2 })} options={[["1", "1 worker"], ["2", "2 workers"]]} />
        <Choice label="Service type" value={hourly.service} onChange={(service) => setHourly({ ...hourly, service })} options={[["weeding", "Weeding"], ["planting", "Planting"], ["tidy", "Garden tidy-up"], ["help", "Minor outdoor help"], ["mixed", "Mixed service"]]} />
      </Grid>
      <ToggleGrid>
        <Toggle checked={hourly.waste} onChange={(waste) => setHourly({ ...hourly, waste })} label="Waste removal" />
        <Toggle checked={hourly.materials} onChange={(materials) => setHourly({ ...hourly, materials })} label="Materials handling" />
      </ToggleGrid>
    </>
  );
}

function Choice<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: [T, string][] }) {
  return (
    <label className="grid gap-2 text-sm font-black text-forest">
      {label}
      <Select value={value} onChange={(event) => onChange(event.target.value as T)} aria-label={label}>
        {options.map(([id, optionLabel]) => (
          <option key={id} value={id}>
            {optionLabel}
          </option>
        ))}
      </Select>
    </label>
  );
}

const Grid = ({ children }: { children: React.ReactNode }) => <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
const ToggleGrid = ({ children }: { children: React.ReactNode }) => <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
