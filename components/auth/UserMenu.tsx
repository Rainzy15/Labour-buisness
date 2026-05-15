"use client";

import Link from "next/link";
import { BriefcaseBusiness, CalendarDays, ChevronDown, LayoutDashboard, LogOut, Settings, ShieldCheck, UserCircle } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/components/language/LanguageProvider";

type UserMenuProps = {
  compact?: boolean;
  onNavigate?: () => void;
};

export function UserMenu({ compact = false, onNavigate }: UserMenuProps) {
  const { user, role, configured } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  async function logout() {
    if (!configured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!configured || !user) {
    return (
      <Link href="/login" onClick={onNavigate} className="inline-flex h-10 items-center rounded-full border border-forest/15 bg-white px-4 text-sm font-extrabold text-forest transition hover:border-forest/30 hover:bg-cream">
        {t("account.login")}
      </Link>
    );
  }

  const menuItems = [
    { href: "/dashboard", label: t("account.dashboard"), icon: LayoutDashboard },
    { href: "/dashboard/bookings", label: t("account.bookings"), icon: CalendarDays },
    ...(role === "admin" || role === "manager" ? [{ href: "/admin", label: t("account.admin"), icon: ShieldCheck }] : []),
    ...(role === "employee" || role === "admin" || role === "manager" ? [{ href: "/employee", label: t("account.employee"), icon: BriefcaseBusiness }] : []),
    { href: "/dashboard/settings", label: t("account.settings"), icon: Settings }
  ];

  if (compact) {
    return (
      <div className="grid gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-forest">
              <Icon className="h-4 w-4 text-fresh" /> {item.label}
            </Link>
          );
        })}
        <button onClick={logout} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left text-sm font-bold text-forest">
          <LogOut className="h-4 w-4 text-fresh" /> {t("account.logout")}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-forest/15 bg-white px-4 text-sm font-black text-forest transition hover:border-forest/30 hover:bg-cream"
        aria-expanded={open}
      >
        <UserCircle className="h-4 w-4" />
        {t("account.account")}
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-[24px] border border-forest/10 bg-white p-2 shadow-premium">
          <div className="border-b border-forest/10 px-3 py-3">
            <p className="text-xs font-bold text-charcoal/55">{t("account.signedInAs")}</p>
            <p className="truncate text-sm font-black text-forest">{user.email}</p>
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-charcoal transition hover:bg-cream hover:text-forest"
              >
                <Icon className="h-4 w-4 text-fresh" /> {item.label}
              </Link>
            );
          })}
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-charcoal transition hover:bg-cream hover:text-forest">
            <LogOut className="h-4 w-4 text-fresh" /> {t("account.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
