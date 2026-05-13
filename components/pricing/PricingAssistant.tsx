"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useMemo, useState } from "react";

type ChatMessage = {
  from: "assistant" | "user";
  text: string;
};

const quickPrompts = [
  "How much for a 300m² lawn?",
  "Which bundle should I choose?",
  "Robot mower rental vs buying?",
  "Can I cancel or reschedule?",
  "What affects the final quote?"
];

export function PricingAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "assistant",
      text: "Hi, I’m the LuxLawn pricing assistant. I can help you choose a service, understand estimates, and decide whether to book a visit."
    }
  ]);

  function ask(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [...current, { from: "user", text: clean }, { from: "assistant", text: answerFor(clean) }]);
    setInput("");
  }

  const visiblePrompts = useMemo(() => quickPrompts.filter((prompt) => !messages.some((message) => message.text === prompt)).slice(0, 4), [messages]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white shadow-premium transition hover:bg-[#0d2f20] lg:bottom-24 lg:right-6"
      >
        <MessageCircle className="h-4 w-4" /> Ask pricing assistant
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-3 bottom-3 z-[60] overflow-hidden rounded-[28px] border border-forest/10 bg-white shadow-premium sm:left-auto sm:right-6 sm:w-[420px]"
          >
            <div className="flex items-center justify-between bg-forest p-4 text-white">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-lime text-forest">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-black">LuxLawn Assistant</h2>
                  <p className="text-xs text-white/65">Rule-based helper, no AI cost</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10" aria-label="Close assistant">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto bg-cream/50 p-4">
              <div className="grid gap-3">
                {messages.map((message, index) => (
                  <div key={`${message.from}-${index}`} className={`max-w-[88%] rounded-[22px] px-4 py-3 text-sm leading-6 ${message.from === "assistant" ? "bg-white text-charcoal shadow-sm" : "ml-auto bg-forest text-white"}`}>
                    {message.text}
                  </div>
                ))}
              </div>
              {visiblePrompts.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {visiblePrompts.map((prompt) => (
                    <button key={prompt} onClick={() => ask(prompt)} className="rounded-full bg-white px-3 py-2 text-xs font-black text-forest shadow-sm">
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-forest/10 bg-white p-3">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  ask(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about price, bundles, booking..."
                  className="min-w-0 flex-1 rounded-full border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/30"
                />
                <button className="grid h-12 w-12 place-items-center rounded-full bg-forest text-white" aria-label="Send message">
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <div className="mt-3 flex gap-2">
                <Link href="/dashboard/book" className="flex-1 rounded-full bg-lime px-4 py-2 text-center text-xs font-black text-forest">
                  Book
                </Link>
                <Link href="/contact" className="flex-1 rounded-full bg-cream px-4 py-2 text-center text-xs font-black text-forest">
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function answerFor(input: string) {
  const text = input.toLowerCase();

  if (text.includes("300") || text.includes("lawn") || text.includes("mow")) {
    return "For a normal 300m² lawn, a typical visit is usually around €75 before add-ons. Edge trimming, collection, terrain, access, and frequency discounts can change it. Use the Lawn tab for the cleanest estimate.";
  }

  if (text.includes("bundle") || text.includes("choose")) {
    return "Best bundle depends on the season: Summer Lawn Care is good for regular mowing, Autumn Clean-Up is best for leaves plus hedge/terrace work, Winter Safety is for snow and salting, and Robot Mower Season is for trying automatic mowing.";
  }

  if (text.includes("robot") || text.includes("buy") || text.includes("rental")) {
    return "Robot rental is best if you want a neat lawn without a €1000+ upfront purchase. Small lawns start from €79/month, medium from €99/month, and large from €129/month. Setup and maintenance can be added.";
  }

  if (text.includes("cancel") || text.includes("reschedule")) {
    return "Customers can cancel online until 24 hours before the appointment. If the visit is within 24 hours, the dashboard asks you to contact LuxLawn directly to cancel or reschedule.";
  }

  if (text.includes("final") || text.includes("change") || text.includes("quote") || text.includes("terrain")) {
    return "The calculator is a realistic estimate. Final price can change because of access, terrain, waste volume, travel distance, urgency, weather, and exact site conditions. Final quotes are confirmed before work.";
  }

  if (text.includes("winter") || text.includes("snow") || text.includes("salt")) {
    return "Winter services are weather-dependent. One-time snow/salting visits are calculated by surface and urgency, while standby plans start from €139/month for priority safety visits.";
  }

  if (text.includes("hedge")) {
    return "Hedge pricing depends mainly on linear metres, height, density, shaping precision, access, and waste removal. Hedges over 2.5m may need confirmation or special equipment.";
  }

  return "I can help with lawn mowing, hedges, leaves, pressure washing, winter salting, bundles, robot mower rental, and booking. Try asking about your garden size, season, or service type.";
}
