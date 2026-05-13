"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Sprout, X } from "lucide-react";
import { useState } from "react";
import { UserMenu } from "@/components/auth/UserMenu";

const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/bundles", label: "Bundles" },
  { href: "/robot-mower-rental", label: "Robot Rental" },
  { href: "/about", label: "About" }
];

const serviceLinks = [
  { href: "/services#summer-services", label: "Lawn Care" },
  { href: "/services#summer-services", label: "Hedge Care" },
  { href: "/services#autumn-services", label: "Leaf Clearing" },
  { href: "/services#autumn-services", label: "Pressure Washing" },
  { href: "/services#winter-services", label: "Winter Services" },
  { href: "/robot-mower-rental", label: "Robot Mower Rental" },
  { href: "/equipment", label: "Equipment" }
];

const mobileLinks = [
  ...primaryNav,
  { href: "/equipment", label: "Equipment" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(18,61,42,0.12)] bg-[#FAF7EF]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex min-w-fit items-center gap-2.5 text-base font-black text-forest">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-forest/95 text-lime">
            <Sprout className="h-4 w-4" />
          </span>
          <span className="tracking-tight">LuxLawn Care</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) =>
            item.href === "/services" ? (
              <div key={item.href} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                <Link href={item.href} className={navClass(pathname === item.href)}>
                  Services <ChevronDown className="h-3.5 w-3.5" />
                </Link>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-11 w-64 rounded-[24px] border border-forest/10 bg-white p-2 shadow-premium"
                    >
                      {serviceLinks.map((link) => (
                        <Link key={`${link.href}-${link.label}`} href={link.href} className="block rounded-2xl px-4 py-3 text-sm font-bold text-charcoal transition hover:bg-cream hover:text-forest">
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={navClass(pathname === item.href)}>
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <select aria-label="Language selector" className="h-10 rounded-full border border-forest/15 bg-white px-3 text-sm font-bold text-forest outline-none transition hover:border-forest/30">
            <option>EN</option>
            <option>FR</option>
            <option>DE</option>
            <option>LU</option>
          </select>
          <UserMenu />
          <Link href="/dashboard/book" className="inline-flex h-10 items-center rounded-full bg-forest px-5 text-sm font-black text-white transition hover:bg-[#0d2f20]">
            Book
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/dashboard/book" className="inline-flex h-10 items-center rounded-full bg-forest px-4 text-sm font-black text-white">
            Book
          </Link>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 bg-white text-forest" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="border-t border-forest/10 bg-[#FAF7EF] px-4 py-4 lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-2">
              {mobileLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-forest">
                  {item.label}
                </Link>
              ))}
              <div className="rounded-2xl bg-white p-3">
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
                  Language
                  <select className="rounded-2xl border border-forest/15 bg-cream px-3 py-3 text-sm font-bold text-forest">
                    <option>English</option>
                    <option>Français</option>
                    <option>Deutsch</option>
                    <option>Lëtzebuergesch</option>
                  </select>
                </label>
              </div>
              <UserMenu compact onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function navClass(active: boolean) {
  return `relative inline-flex h-10 items-center gap-1 rounded-full px-3.5 text-sm font-bold transition ${
    active ? "bg-white text-forest shadow-sm" : "text-charcoal/75 hover:bg-white/70 hover:text-forest"
  }`;
}
