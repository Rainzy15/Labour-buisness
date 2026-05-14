"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/language/LanguageProvider";
import type { BreakdownLine, Estimate } from "@/lib/pricing";
import { eur } from "@/lib/pricing";

export function AnimatedNumber({ value, className = "" }: { value: number; className?: string }) {
  return (
    <motion.span key={Math.round(value)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className={className}>
      {eur(value)}
    </motion.span>
  );
}

export function PremiumSlider({
  label,
  value,
  min,
  max,
  suffix,
  helper,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  helper?: string;
  onChange: (value: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="rounded-[22px] border border-forest/10 bg-white p-4 shadow-sm sm:rounded-[26px] sm:p-5">
      <div className="mb-3 grid gap-2 sm:flex sm:items-start sm:justify-between sm:gap-4">
        <div>
          <label className="text-sm font-black text-forest">{label}</label>
          {helper && <p className="mt-1 text-xs font-bold text-charcoal/55">{helper}</p>}
        </div>
        <span className="w-fit rounded-full bg-lime px-3 py-1 text-sm font-black text-forest">
          {value} {suffix}
        </span>
      </div>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-3 w-full cursor-pointer appearance-none rounded-full bg-transparent"
        style={{
          background: `linear-gradient(90deg, #5DBB63 ${percentage}%, rgba(18,61,42,.12) ${percentage}%)`
        }}
      />
      <div className="mt-2 flex justify-between text-xs font-bold text-charcoal/45">
        <span>{min} {suffix}</span>
        <span>{max} {suffix}</span>
      </div>
    </div>
  );
}

export function ServiceTabCard({
  active,
  icon: Icon,
  label,
  price,
  onClick
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  price: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative min-w-[132px] rounded-[22px] border p-3 text-left transition sm:min-w-[150px] sm:rounded-[24px] sm:p-4 ${active ? "border-fresh bg-forest text-white shadow-premium" : "border-forest/10 bg-white text-forest hover:-translate-y-1 hover:shadow-glass"}`}
    >
      {active && <motion.span layoutId="activePricingTab" className="absolute inset-0 rounded-[24px] bg-fresh/10" />}
      <span className="relative z-10 grid gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-2xl ${active ? "bg-lime text-forest" : "bg-cream text-forest"}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-black">{label}</span>
          <span className={`text-xs font-bold ${active ? "text-white/70" : "text-charcoal/55"}`}>{price}</span>
        </span>
      </span>
    </button>
  );
}

export function EstimateBreakdown({ lines }: { lines: BreakdownLine[] }) {
  const max = Math.max(...lines.map((line) => Math.abs(line.amount)), 1);
  return (
    <div className="grid gap-3">
      {lines.map((line) => {
        const width = `${Math.max(6, (Math.abs(line.amount) / max) * 100)}%`;
        const color = line.amount < 0 ? "bg-fresh" : line.kind === "difficulty" ? "bg-autumn" : line.kind === "addon" ? "bg-lime" : line.kind === "minimum" ? "bg-winter" : "bg-forest";
        return (
          <div key={line.label}>
            <div className="mb-1 flex justify-between gap-3 text-xs font-bold text-charcoal/65">
              <span>{line.label}</span>
              <span className={line.amount < 0 ? "text-fresh" : "text-forest"}>{eur(line.amount)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-forest/10">
              <div className={`h-full rounded-full ${color}`} style={{ width }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PricingDisclaimer() {
  const { t } = useLanguage();
  return (
    <div className="rounded-[24px] border border-forest/10 bg-white p-4 text-sm font-bold leading-6 text-forest shadow-sm">
      {t("pricing.launchDisclaimer")}
    </div>
  );
}

export function BundleSuggestion({ basket }: { basket: Estimate[] }) {
  const ids = basket.map((item) => item.category);
  const suggestion = ids.includes("lawn") && ids.includes("hedge")
    ? "Summer Garden Bundle: lawn + hedge + waste removal can save up to 15%."
      : ids.includes("leaves") && ids.includes("hedge") && ids.includes("pressure")
        ? "Autumn Clean-Up Bundle: leaves + hedge + pressure washing can save up to 10%."
        : ids.includes("winter")
          ? "Winter Safety Bundle: snow clearing + salting starts from €69.50/month."
          : "Add related services to unlock a bundle recommendation.";
  return <p className="rounded-2xl bg-white/10 p-3 text-sm font-bold text-white/78">{suggestion}</p>;
}

export function QuoteBasket({ items, onRemove }: { items: Estimate[]; onRemove: (index: number) => void }) {
  const oneTime = items.filter((item) => !item.monthly || item.cadence === "season").reduce((total, item) => total + item.total, 0);
  const monthly = items.reduce((total, item) => total + (item.monthly && item.cadence !== "season" ? item.monthly : item.cadence === "monthly" ? item.total : 0), 0);
  const savings = items.reduce((total, item) => total + (item.savings && item.savings > 0 ? item.savings : 0), 0);

  return (
    <div className="rounded-[24px] bg-forest p-4 text-white shadow-premium sm:rounded-[30px] sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">Quote basket</h2>
          <p className="text-sm text-white/65">Combine services before requesting a final quote.</p>
        </div>
        <span className="rounded-full bg-lime px-3 py-1 text-sm font-black text-forest">{items.length}</span>
      </div>
      <div className="mt-4"><BundleSuggestion basket={items} /></div>
      <div className="my-4 grid gap-3">
        <AnimatePresence initial={false}>
          {items.length === 0 && <p className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">Add a service estimate to start a quote.</p>}
          {items.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 p-3"
            >
              <div>
                <p className="text-sm font-black">{item.name}</p>
                <p className="text-xs text-white/65">{item.monthly && item.cadence !== "season" ? `${eur(item.total)} per visit · ${eur(item.monthly)}/mo` : eur(item.total)}</p>
              </div>
              <button aria-label={`Remove ${item.name}`} onClick={() => onRemove(index)} className="rounded-full bg-white/10 p-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="grid gap-2 border-t border-white/15 pt-4 text-sm">
        <div className="flex justify-between"><span className="text-white/65">One-time / seasonal total</span><strong>{eur(oneTime)}</strong></div>
        <div className="flex justify-between"><span className="text-white/65">Monthly recurring estimate</span><strong>{eur(monthly)}</strong></div>
        <div className="flex justify-between"><span className="text-white/65">Visible calculator savings</span><strong className="text-lime">{eur(savings)}</strong></div>
      </div>
      <Link href="/dashboard/book" className="mt-4 block rounded-full bg-lime px-5 py-3 text-center text-sm font-black text-forest">
        Request final quote
      </Link>
      <Link href="/contact" className="mt-2 block rounded-full bg-white/10 px-5 py-3 text-center text-sm font-black text-white">
        Ask a question first
      </Link>
    </div>
  );
}

export function LiveEstimateCard({ estimate, onAdd }: { estimate: Estimate; onAdd: () => void }) {
  const [open, setOpen] = useState(true);
  const monthlyExplanation = estimate.visitsPerMonth
    ? estimate.visitsPerMonth === 4
      ? "Weekly = 4 visits/month for planning."
      : estimate.visitsPerMonth === 2
        ? "Biweekly = 2 visits/month for planning."
        : "Monthly = 1 visit/month."
    : estimate.monthly
      ? "Monthly contract estimate."
      : "One-time service estimate.";

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-premium sm:rounded-[32px] sm:p-6">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-fresh">Live estimate</p>
      <h2 className="mt-2 text-2xl font-black text-forest">{estimate.name}</h2>
      <div className="mt-4 rounded-[28px] bg-cream p-5">
        <p className="text-sm font-bold text-charcoal/60">Estimated total</p>
        <AnimatedNumber value={estimate.total} className="block text-4xl font-black text-forest sm:text-5xl" />
        {estimate.monthly && estimate.cadence !== "season" && <p className="mt-2 text-sm font-bold text-charcoal/70">{eur(estimate.monthly)} monthly estimate. {monthlyExplanation}</p>}
        {estimate.deposit && <p className="mt-2 text-sm font-bold text-charcoal/70">{eur(estimate.deposit)} refundable deposit shown separately.</p>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-fresh/15 px-3 py-1 text-xs font-black text-forest">Estimate confidence: {estimate.confidence}</span>
        <span className="rounded-full bg-lime/50 px-3 py-1 text-xs font-black text-forest">{estimate.cadence}</span>
      </div>
      {estimate.warnings?.map((warning) => (
        <p key={warning} className="mt-3 flex gap-2 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {warning}
        </p>
      ))}
      <button onClick={() => setOpen(!open)} className="mt-5 flex w-full items-center justify-between rounded-2xl bg-cream px-4 py-3 text-sm font-black text-forest">
        Price breakdown <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-4"><EstimateBreakdown lines={estimate.breakdown} /></div>}
      <InfoList title="Included" items={estimate.included} />
      <InfoList title="May change price" items={estimate.mayChange} />
      <p className="mt-4 rounded-2xl bg-fresh/10 p-3 text-sm font-bold text-forest">{estimate.recommendation}</p>
      <div className="mt-5 grid gap-2">
        <button onClick={onAdd} className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white">Add to quote</button>
        <Link href="/dashboard/book" className="rounded-full bg-lime px-5 py-3 text-center text-sm font-black text-forest">Request final quote</Link>
      </div>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-black text-forest">{title}</h3>
      <div className="mt-2 grid gap-2">
        {items.map((item) => (
          <p key={item} className="flex gap-2 text-sm text-charcoal/70">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fresh" /> {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export function MobileStickyEstimateBar({ estimate, onAdd }: { estimate: Estimate; onAdd: () => void }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-[24px] bg-forest p-3 text-white shadow-premium lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-white/65">{estimate.name}</p>
          <p className="text-2xl font-black">{eur(estimate.total)}</p>
        </div>
        <button onClick={onAdd} className="rounded-full bg-lime px-4 py-3 text-sm font-black text-forest">Add</button>
      </div>
    </div>
  );
}

export function SeasonalGradientBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.span animate={{ x: [0, 24, 0], y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 12 }} className="absolute left-8 top-14 h-44 w-44 rounded-full bg-lime/30 blur-3xl" />
      <motion.span animate={{ x: [0, -20, 0], y: [0, 18, 0] }} transition={{ repeat: Infinity, duration: 14 }} className="absolute right-10 top-24 h-56 w-56 rounded-full bg-fresh/20 blur-3xl" />
    </div>
  );
}
