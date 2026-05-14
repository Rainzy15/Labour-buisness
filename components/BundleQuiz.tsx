"use client";

import { useState } from "react";
import { bundles } from "@/lib/data";

const map: Record<string, string> = {
  "Lawn always neat": "Summer Lawn Care Bundle",
  "Winter safety": "Winter Safety Bundle",
  "Autumn leaves": "Autumn Clean-Up Bundle",
  "Full garden care": "Full Garden Summer Bundle",
  "Monthly help": "Monthly Garden Maintenance Bundle"
};

export function BundleQuiz() {
  const [choice, setChoice] = useState("Lawn always neat");
  const bundle = bundles.find((b) => b.name === map[choice])!;
  return (
    <div className="grid gap-5 rounded-[34px] bg-forest p-6 text-white shadow-premium lg:grid-cols-[.9fr_1.1fr]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-lime">Bundle quiz</p>
        <h2 className="mt-2 text-3xl font-black">What do you need help with?</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {Object.keys(map).map((item) => (
            <button key={item} onClick={() => setChoice(item)} className={`rounded-full px-4 py-2 text-sm font-black transition ${choice === item ? "bg-lime text-forest" : "bg-white/10 text-white"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-3xl bg-white p-5 text-forest">
        <p className="text-sm font-black text-fresh">Recommended</p>
        <h3 className="mt-1 text-2xl font-black">{bundle.name}</h3>
        <p className="mt-2 text-sm text-charcoal/70">{bundle.bestFor}</p>
        <p className="mt-4 text-3xl font-black">{bundle.price}</p>
      </div>
    </div>
  );
}
