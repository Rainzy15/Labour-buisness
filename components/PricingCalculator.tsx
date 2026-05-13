"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
  calculateHedge,
  calculateHourly,
  calculateLawn,
  calculateLeaves,
  calculatePressure,
  calculateRobot,
  calculateWinter,
  Estimate,
  eur
} from "@/lib/pricing";
import { FieldLabel, Select, Toggle } from "@/components/ui";

type Tab = "lawn" | "hedges" | "leaves" | "pressure" | "winter" | "hourly" | "robot";
type LawnState = Parameters<typeof calculateLawn>[0];
type HedgeState = Parameters<typeof calculateHedge>[0];
type LeavesState = Parameters<typeof calculateLeaves>[0];
type PressureState = Parameters<typeof calculatePressure>[0];
type WinterState = Parameters<typeof calculateWinter>[0];
type HourlyState = Parameters<typeof calculateHourly>[0];
type RobotState = Parameters<typeof calculateRobot>[0];
const tabs: [Tab, string][] = [
  ["lawn", "Lawn"],
  ["hedges", "Hedges"],
  ["leaves", "Leaves"],
  ["pressure", "Pressure Washing"],
  ["winter", "Winter"],
  ["hourly", "Hourly"],
  ["robot", "Robot Rental"]
];

export function PricingCalculator({ initialTab = "lawn" }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [basket, setBasket] = useState<Estimate[]>([]);
  const [lawn, setLawn] = useState<LawnState>({ size: 350, frequency: "biweekly", grass: "normal", edge: true, collection: false, waste: false, terrain: "easy", access: "easy" });
  const [hedge, setHedge] = useState<HedgeState>({ length: 18, height: "medium", density: "normal", shaping: "clean", waste: true });
  const [leaves, setLeaves] = useState<LeavesState>({ area: 300, density: "medium", removal: "bags", frequency: "oneTime" });
  const [pressure, setPressure] = useState<PressureState>({ area: 35, surface: "terrace", dirt: "normalDirt", treatment: false });
  const [winter, setWinter] = useState<WinterState>({ area: 60, service: "combined", timing: "planned", surface: "driveway", contract: "oneTime" });
  const [hourly, setHourly] = useState<HourlyState>({ hours: 2, workers: 1, service: "weeding", waste: false });
  const [robot, setRobot] = useState<RobotState>({ size: 450, duration: "sixMonths", setup: "assisted", maintenance: "midSeason", delivery: "mid", deposit: true, storage: false });

  const estimate = useMemo(() => {
    if (tab === "lawn") return calculateLawn(lawn);
    if (tab === "hedges") return calculateHedge(hedge);
    if (tab === "leaves") return calculateLeaves(leaves);
    if (tab === "pressure") return calculatePressure(pressure);
    if (tab === "winter") return calculateWinter(winter);
    if (tab === "hourly") return calculateHourly(hourly);
    return calculateRobot(robot);
  }, [tab, lawn, hedge, leaves, pressure, winter, hourly, robot]);

  const subtotal = basket.reduce((sum, item) => sum + item.total, 0);
  const suggested = basket.some((i) => i.name.includes("Lawn")) && basket.some((i) => i.name.includes("Hedge")) ? "Full Garden Summer Bundle may save up to 15%." : basket.some((i) => i.name.includes("Winter")) ? "Winter Safety Bundle may fit this quote." : "Add two related services to unlock a bundle suggestion.";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
      <div className="rounded-[32px] bg-white p-4 shadow-premium sm:p-6">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${tab === id ? "bg-forest text-white" : "bg-cream text-forest hover:bg-lime/60"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="grid gap-5">
          {tab === "lawn" && (
            <>
              <Slider label="Lawn size" value={lawn.size} min={50} max={1500} suffix="m²" onChange={(size) => setLawn({ ...lawn, size })} />
              <Grid>
                <Choice label="Visit frequency" value={lawn.frequency} onChange={(frequency) => setLawn({ ...lawn, frequency })} options={[["oneTime", "One-time"], ["weekly", "Weekly"], ["biweekly", "Every 2 weeks"], ["monthly", "Monthly"]]} />
                <Choice label="Grass length" value={lawn.grass} onChange={(grass) => setLawn({ ...lawn, grass })} options={[["normal", "Normal"], ["long", "Long"], ["overgrown", "Overgrown"]]} />
                <Choice label="Terrain difficulty" value={lawn.terrain} onChange={(terrain) => setLawn({ ...lawn, terrain })} options={[["easy", "Easy"], ["medium", "Medium"], ["difficult", "Difficult"]]} />
                <Choice label="Access difficulty" value={lawn.access} onChange={(access) => setLawn({ ...lawn, access })} options={[["easy", "Easy"], ["narrow", "Narrow access"], ["complex", "Stairs/complex"]]} />
              </Grid>
              <ToggleGrid>
                <Toggle checked={lawn.edge} onChange={(edge) => setLawn({ ...lawn, edge })} label="Edge trimming" />
                <Toggle checked={lawn.collection} onChange={(collection) => setLawn({ ...lawn, collection })} label="Grass collection" />
                <Toggle checked={lawn.waste} onChange={(waste) => setLawn({ ...lawn, waste })} label="Green waste removal" />
              </ToggleGrid>
            </>
          )}
          {tab === "hedges" && (
            <>
              <Slider label="Hedge length" value={hedge.length} min={1} max={100} suffix="linear m" onChange={(length) => setHedge({ ...hedge, length })} />
              <Grid>
                <Choice label="Hedge height" value={hedge.height} onChange={(height) => setHedge({ ...hedge, height })} options={[["low", "Under 1.5m"], ["medium", "1.5-2.5m"], ["high", "Over 2.5m"]]} />
                <Choice label="Hedge density" value={hedge.density} onChange={(density) => setHedge({ ...hedge, density })} options={[["light", "Light"], ["normal", "Normal"], ["dense", "Dense"]]} />
                <Choice label="Shape precision" value={hedge.shaping} onChange={(shaping) => setHedge({ ...hedge, shaping })} options={[["basic", "Basic trim"], ["clean", "Clean shaping"], ["premium", "Premium shaping"]]} />
              </Grid>
              <Toggle checked={hedge.waste} onChange={(waste) => setHedge({ ...hedge, waste })} label="Waste removal" />
            </>
          )}
          {tab === "leaves" && (
            <>
              <Slider label="Leaf area" value={leaves.area} min={50} max={2000} suffix="m²" onChange={(area) => setLeaves({ ...leaves, area })} />
              <Grid>
                <Choice label="Leaf density" value={leaves.density} onChange={(density) => setLeaves({ ...leaves, density })} options={[["light", "Light"], ["medium", "Medium"], ["heavy", "Heavy"]]} />
                <Choice label="Removal option" value={leaves.removal} onChange={(removal) => setLeaves({ ...leaves, removal })} options={[["bags", "Leave in bags"], ["takeAway", "Take away green waste"], ["compost", "Compost pile on property"]]} />
                <Choice label="Frequency" value={leaves.frequency} onChange={(frequency) => setLeaves({ ...leaves, frequency })} options={[["oneTime", "One-time"], ["threeVisits", "3-visit autumn plan"], ["fiveVisits", "5-visit autumn plan"]]} />
              </Grid>
            </>
          )}
          {tab === "pressure" && (
            <>
              <Slider label="Surface area" value={pressure.area} min={10} max={300} suffix="m²" onChange={(area) => setPressure({ ...pressure, area })} />
              <Grid>
                <Choice label="Surface type" value={pressure.surface} onChange={(surface) => setPressure({ ...pressure, surface })} options={[["terrace", "Terrace"], ["driveway", "Driveway"], ["stonePath", "Stone path"], ["facadeLower", "Facade lower section"]]} />
                <Choice label="Dirt level" value={pressure.dirt} onChange={(dirt) => setPressure({ ...pressure, dirt })} options={[["lightDirt", "Light"], ["normalDirt", "Normal"], ["heavyMoss", "Heavy moss/algae"]]} />
              </Grid>
              <Toggle checked={pressure.treatment} onChange={(treatment) => setPressure({ ...pressure, treatment })} label="Protective treatment" />
            </>
          )}
          {tab === "winter" && (
            <>
              <Slider label="Winter surface area" value={winter.area} min={10} max={500} suffix="m²" onChange={(area) => setWinter({ ...winter, area })} />
              <Grid>
                <Choice label="Service type" value={winter.service} onChange={(service) => setWinter({ ...winter, service })} options={[["snow", "Snow clearing only"], ["salting", "Salting only"], ["combined", "Snow clearing + salting"]]} />
                <Choice label="Visit timing" value={winter.timing} onChange={(timing) => setWinter({ ...winter, timing })} options={[["planned", "Planned"], ["sameDay", "Same day"], ["emergency", "Emergency early morning"]]} />
                <Choice label="Surface type" value={winter.surface} onChange={(surface) => setWinter({ ...winter, surface })} options={[["pathway", "Pathway"], ["driveway", "Driveway"], ["residence", "Residence entrance"], ["business", "Small business entrance"]]} />
                <Choice label="Contract type" value={winter.contract} onChange={(contract) => setWinter({ ...winter, contract })} options={[["oneTime", "One-time visit"], ["standby", "Winter standby contract"]]} />
              </Grid>
            </>
          )}
          {tab === "hourly" && (
            <>
              <Slider label="Hours" value={hourly.hours} min={1} max={8} suffix="hours" onChange={(hours) => setHourly({ ...hourly, hours })} />
              <Grid>
                <Choice label="Number of workers" value={String(hourly.workers)} onChange={(workers) => setHourly({ ...hourly, workers: Number(workers) as 1 | 2 })} options={[["1", "1 worker"], ["2", "2 workers"]]} />
                <Choice label="Service type" value={hourly.service} onChange={(service) => setHourly({ ...hourly, service })} options={[["weeding", "Weeding"], ["planting", "Planting"], ["tidy", "Garden tidy-up"], ["help", "Minor outdoor help"], ["mixed", "Mixed service"]]} />
              </Grid>
              <Toggle checked={hourly.waste} onChange={(waste) => setHourly({ ...hourly, waste })} label="Waste removal" />
            </>
          )}
          {tab === "robot" && <RobotControls robot={robot} setRobot={setRobot} />}
        </div>
      </div>
      <aside className="sticky bottom-3 z-30 lg:top-24 lg:self-start">
        <PriceCard estimate={estimate} onAdd={() => setBasket([...basket, estimate])} />
        <div className="mt-5 rounded-[28px] bg-forest p-5 text-white shadow-premium">
          <h2 className="text-xl font-black">Quote basket</h2>
          <p className="mt-1 text-sm text-white/70">{suggested}</p>
          <div className="my-4 grid gap-2">
            {basket.length === 0 && <p className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">Add estimates to combine services.</p>}
            {basket.map((item, index) => (
              <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 p-3">
                <div>
                  <p className="text-sm font-black">{item.name}</p>
                  <p className="text-xs text-white/70">{eur(item.total)}</p>
                </div>
                <button aria-label={`Remove ${item.name}`} onClick={() => setBasket(basket.filter((_, i) => i !== index))} className="rounded-full bg-white/10 p-2">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-end justify-between border-t border-white/15 pt-4">
            <span className="text-sm text-white/70">Estimated total</span>
            <strong className="text-3xl">{eur(subtotal)}</strong>
          </div>
          <a href="/contact" className="mt-4 block rounded-full bg-lime px-5 py-3 text-center text-sm font-black text-forest">
            Send quote request
          </a>
        </div>
      </aside>
    </div>
  );
}

export function RobotControls({ robot, setRobot }: { robot: RobotState; setRobot: (value: RobotState) => void }) {
  return (
    <>
      <Slider label="Lawn size" value={robot.size} min={100} max={1000} suffix="m²" onChange={(size) => setRobot({ ...robot, size })} />
      <Grid>
        <Choice label="Rental duration" value={robot.duration} onChange={(duration) => setRobot({ ...robot, duration })} options={[["oneMonth", "1 month"], ["threeMonths", "3 months"], ["sixMonths", "6 months full season"], ["eightMonths", "8 months extended season"]]} />
        <Choice label="Setup option" value={robot.setup} onChange={(setup) => setRobot({ ...robot, setup })} options={[["diy", "DIY setup"], ["assisted", "Assisted setup"], ["full", "Full setup"]]} />
        <Choice label="Maintenance check" value={robot.maintenance} onChange={(maintenance) => setRobot({ ...robot, maintenance })} options={[["none", "None"], ["monthly", "Monthly check"], ["midSeason", "Mid-season check"]]} />
        <Choice label="Delivery distance" value={robot.delivery} onChange={(delivery) => setRobot({ ...robot, delivery })} options={[["near", "0-10 km"], ["mid", "10-25 km"], ["far", "25km+"]]} />
      </Grid>
      <ToggleGrid>
        <Toggle checked={robot.deposit} onChange={(deposit) => setRobot({ ...robot, deposit })} label="Show refundable €200 deposit" />
        <Toggle checked={robot.storage} onChange={(storage) => setRobot({ ...robot, storage })} label="Optional winter storage" />
      </ToggleGrid>
    </>
  );
}

function PriceCard({ estimate, onAdd }: { estimate: Estimate; onAdd: () => void }) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-premium">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-fresh">Live estimate</p>
      <h2 className="mt-2 text-2xl font-black text-forest">{estimate.name}</h2>
      <div className="mt-4 rounded-3xl bg-cream p-5">
        <p className="text-sm font-bold text-charcoal/60">Estimated total</p>
        <motion.p key={Math.round(estimate.total)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black text-forest">
          {eur(estimate.total)}
        </motion.p>
        {estimate.monthly && <p className="mt-1 text-sm font-bold text-charcoal/70">{eur(estimate.monthly)} monthly estimate where relevant</p>}
        {estimate.deposit && <p className="mt-1 text-sm font-bold text-charcoal/70">{eur(estimate.deposit)} refundable deposit shown separately</p>}
      </div>
      <div className="mt-5 grid gap-2">
        {estimate.breakdown.map((line) => (
          <div key={line.label} className="flex justify-between gap-3 text-sm">
            <span className="text-charcoal/70">{line.label}</span>
            <strong className={line.amount < 0 ? "text-fresh" : "text-forest"}>{eur(line.amount)}</strong>
          </div>
        ))}
      </div>
      {estimate.note && <p className="mt-4 rounded-2xl bg-winter p-3 text-sm font-bold text-forest">{estimate.note}</p>}
      <button onClick={onAdd} className="mt-5 w-full rounded-full bg-forest px-5 py-3 text-sm font-black text-white transition hover:bg-charcoal">
        Add this service to quote
      </button>
    </div>
  );
}

function Slider({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <div>
      <FieldLabel label={label} value={`${value} ${suffix}`} />
      <input aria-label={label} className="range h-3 w-full cursor-pointer" type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function Choice<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: [T, string][] }) {
  return (
    <div>
      <FieldLabel label={label} />
      <Select value={value} onChange={(e) => onChange(e.target.value as T)} aria-label={label}>
        {options.map(([id, label]) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}

const Grid = ({ children }: { children: React.ReactNode }) => <div className="grid gap-4 md:grid-cols-2">{children}</div>;
const ToggleGrid = ({ children }: { children: React.ReactNode }) => <div className="grid gap-3 md:grid-cols-3">{children}</div>;
