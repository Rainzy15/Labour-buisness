"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Select } from "@/components/ui";

export function ContactForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const required = ["name", "email", "phone", "commune", "service", "season", "size", "date"];
    const missing = required.some((key) => !String(data.get(key) || "").trim()) || data.get("agree") !== "on";
    if (missing) {
      setError("Please complete the required fields and confirm the estimate checkbox.");
      return;
    }
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-[34px] bg-white p-8 text-center shadow-premium">
        <CheckCircle2 className="mx-auto h-14 w-14 text-fresh" />
        <h2 className="mt-4 text-3xl font-black text-forest">Request received</h2>
        <p className="mt-3 text-charcoal/70">Placeholder success message: we'll reply with a clearer quote after reviewing your garden details and photos.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[34px] bg-white p-6 shadow-premium">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" label="Name" />
        <Input name="email" label="Email" type="email" />
        <Input name="phone" label="Phone" />
        <Input name="commune" label="Address / commune" />
        <Field label="Service needed"><Select name="service"><option>Lawn care</option><option>Hedge care</option><option>Leaf clearing</option><option>Pressure washing</option><option>Snow clearing / salting</option><option>Garden maintenance</option><option>Seasonal bundle</option></Select></Field>
        <Field label="Season"><Select name="season"><option>Spring</option><option>Summer</option><option>Autumn</option><option>Winter</option></Select></Field>
        <Input name="size" label="Garden size / surface area" placeholder="e.g. 350 m²" />
        <Input name="date" label="Preferred date" type="date" />
      </div>
      <Field label="Upload photos placeholder"><input className="w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm" type="file" multiple /></Field>
      <Field label="Message"><textarea name="message" className="min-h-32 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" /></Field>
      <label className="flex gap-3 rounded-2xl bg-cream p-4 text-sm font-bold text-forest"><input name="agree" type="checkbox" /> I understand this is an estimate and final price may vary.</label>
      {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      <button className="rounded-full bg-forest px-6 py-3 text-sm font-black text-white">Submit booking request</button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-black text-forest">{label}{children}</label>;
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <Field label={label}><input {...props} className="w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" /></Field>;
}
