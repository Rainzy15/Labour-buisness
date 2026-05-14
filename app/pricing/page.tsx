"use client";

import { PricingCalculator } from "@/components/PricingCalculator";
import { useLanguage } from "@/components/language/LanguageProvider";
import { PricingAssistant } from "@/components/pricing/PricingAssistant";
import { PricingDisclaimer, SeasonalGradientBackground } from "@/components/pricing/PricingUi";
import { Container, Eyebrow, Section } from "@/components/ui";

export default function PricingPage() {
  const { t } = useLanguage();
  const previewCards = [
    [t("pricing.card.lawn"), t("pricing.preview.lawn")],
    [t("pricing.card.garden"), t("pricing.preview.garden")],
    [t("pricing.card.hedge"), t("pricing.preview.hedge")],
    [t("pricing.card.winter"), t("pricing.preview.winter")]
  ];
  const badges = [t("pricing.badge.market"), t("pricing.badge.callout"), t("pricing.badge.savings"), t("pricing.badge.quote")];

  return (
    <Section className="overflow-hidden bg-cream pb-24 lg:pb-16">
      <SeasonalGradientBackground />
      <Container className="relative">
        <div className="mb-8 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <Eyebrow>{t("pricing.eyebrow")}</Eyebrow>
            <h1 className="text-4xl font-black leading-tight text-forest sm:text-6xl">{t("pricing.title")}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-charcoal/70">
              {t("pricing.subtitle")}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge} className="rounded-full bg-white px-4 py-2 text-xs font-black text-forest shadow-sm">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {previewCards.map(([label, value]) => (
              <div key={label} className="rounded-[26px] border border-white/70 bg-white/78 p-5 shadow-glass backdrop-blur">
                <p className="text-sm font-bold text-charcoal/60">{label}</p>
                <p className="mt-2 text-2xl font-black text-forest">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <PricingDisclaimer />
        </div>
        <PricingCalculator />
        <PricingAssistant />
      </Container>
    </Section>
  );
}
