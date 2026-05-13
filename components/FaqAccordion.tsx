"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqAccordion({ groups }: { groups: Record<string, string[][]> }) {
  const [open, setOpen] = useState("Pricing-0");
  return (
    <div className="grid gap-8">
      {Object.entries(groups).map(([category, items]) => (
        <section key={category}>
          <h2 className="mb-4 text-2xl font-black text-forest">{category} FAQ</h2>
          <div className="grid gap-3">
            {items.map(([q, a], index) => {
              const id = `${category}-${index}`;
              const active = open === id;
              return (
                <div key={q} className="rounded-3xl border border-forest/10 bg-white shadow-sm">
                  <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-black text-forest" onClick={() => setOpen(active ? "" : id)} aria-expanded={active}>
                    {q}
                    <ChevronDown className={`h-5 w-5 shrink-0 transition ${active ? "rotate-180" : ""}`} />
                  </button>
                  {active && <p className="px-5 pb-5 text-sm leading-7 text-charcoal/75">{a}</p>}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
