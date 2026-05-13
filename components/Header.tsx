"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sprout, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/lib/data";
import { UserMenu } from "@/components/auth/UserMenu";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-cream/82 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 text-lg font-black text-forest">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-lime">
            <Sprout className="h-5 w-5" />
          </span>
          LuxLawn Care
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.slice(0, 8).map((item) => (
            <Link key={item.href} href={item.href} className={`rounded-full px-3 py-2 text-sm font-bold transition ${pathname === item.href ? "bg-white text-forest shadow-sm" : "text-charcoal hover:bg-white/70"}`}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <div className="rounded-full border border-forest/10 bg-white px-3 py-2 text-xs font-black text-forest">EN / FR / DE / LU</div>
          <Link href="/pricing" className="rounded-full bg-forest px-4 py-2 text-sm font-extrabold text-white transition hover:bg-charcoal">Get instant estimate</Link>
          <UserMenu />
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-full bg-white text-forest lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Open menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-forest/10 bg-cream px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-forest">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
