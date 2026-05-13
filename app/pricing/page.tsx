import { PricingCalculator } from "@/components/PricingCalculator";
import { Container, Eyebrow, Section } from "@/components/ui";

export default function PricingPage() {
  return (
    <Section className="bg-cream">
      <Container>
        <div className="mb-8 max-w-3xl">
          <Eyebrow>Transparent estimates</Eyebrow>
          <h1 className="text-5xl font-black text-forest">Instant Pricing Calculator</h1>
          <p className="mt-4 text-lg leading-8 text-charcoal/70">
            Prices are estimates based on typical Luxembourg market rates. Final price depends on access, terrain, waste volume, and exact location.
          </p>
          <p className="mt-3 rounded-2xl bg-white p-4 text-sm font-bold text-forest shadow-sm">
            Estimated prices are based on typical Luxembourg garden service rates in 2026. Final pricing may vary depending on terrain, access, waste volume, travel distance, urgency, and weather conditions.
          </p>
        </div>
        <PricingCalculator />
      </Container>
    </Section>
  );
}
