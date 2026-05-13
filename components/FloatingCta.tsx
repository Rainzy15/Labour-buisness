"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

export function FloatingCta() {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-5 right-5 z-40 hidden flex-col gap-3 lg:flex">
      <Link href="/pricing" className="rounded-full bg-lime px-5 py-3 text-sm font-black text-forest shadow-premium">
        {t("floating.quote")}
      </Link>
      <Link href="/contact" className="grid h-12 w-12 place-items-center rounded-full bg-forest text-white shadow-premium" aria-label="WhatsApp contact placeholder">
        <MessageCircle className="h-5 w-5" />
      </Link>
    </div>
  );
}
