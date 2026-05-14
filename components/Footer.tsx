"use client";

import Link from "next/link";
import { areas, navItems } from "@/lib/data";
import { Sprout } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-forest px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-2 text-xl font-black">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-lime text-forest">
              <Sprout className="h-5 w-5" />
            </span>
            LuxLawn Care
          </div>
          <p className="max-w-md text-sm leading-7 text-white/72">
            {t("footer.copy")}
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-lime">{t("footer.pages")}</h2>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link className="text-sm text-white/75 hover:text-lime" key={item.href} href={item.href}>
                {t(navKeyForHref(item.href))}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-lime">{t("footer.areas")}</h2>
          <p className="text-sm leading-7 text-white/72">{areas.join(" · ")} · {t("footer.other")}</p>
        </div>
      </div>
    </footer>
  );
}

function navKeyForHref(href: string) {
  const keys: Record<string, string> = {
    "/": "nav.home",
    "/services": "nav.services",
    "/pricing": "nav.pricing",
    "/bundles": "nav.bundles",
    "/equipment": "nav.equipment",
    "/about": "nav.about",
    "/faq": "nav.faq",
    "/contact": "nav.contact"
  };

  return keys[href] ?? href;
}
