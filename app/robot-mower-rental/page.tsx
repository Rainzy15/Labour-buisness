import { Bot, CheckCircle2 } from "lucide-react";
import { PricingCalculator } from "@/components/PricingCalculator";
import { process } from "@/lib/data";
import { ButtonLink, Container, Eyebrow, MotionCard, Section } from "@/components/ui";

export default function RobotPage() {
  const rows = [
    ["Upfront cost", "Approx. €1000 upfront", "From €39.50/month"],
    ["Maintenance", "Owner handles blades and checks", "Optional monthly or mid-season check"],
    ["Storage", "You store it in winter", "Optional winter storage"],
    ["Flexibility", "Long-term commitment", "Choose 1, 3, 6, or 8 months"],
    ["Good for first-time users", "Higher risk if unsure", "Best for trying before buying"],
    ["Seasonal use", "Machine sits unused off-season", "Rent only when needed"]
  ];
  return (
    <>
      <section className="bg-robot bg-cover bg-center px-4 py-24 text-white sm:px-6 lg:px-8">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Seasonal robot rental</Eyebrow>
            <h1 className="text-5xl font-black leading-tight sm:text-7xl">Rent a Robot Lawn Mower for the Season</h1>
            <p className="mt-5 text-xl text-white/82">Perfect lawn, no mowing, no €1000 upfront purchase.</p>
            <div className="mt-8"><ButtonLink href="#calculator" variant="secondary">Calculate rental price</ButtonLink></div>
          </div>
        </Container>
      </section>
      <Section className="bg-cream">
        <Container>
          <Eyebrow>How it works</Eyebrow>
          <div className="grid gap-5 md:grid-cols-5">
            {process.map(([label, Icon]: any) => <MotionCard key={label} className="text-center"><Icon className="mx-auto mb-4 h-8 w-8 text-fresh" /><h2 className="font-black text-forest">{label}</h2></MotionCard>)}
          </div>
        </Container>
      </Section>
      <Section className="bg-white">
        <Container>
          <Eyebrow>Rental tiers</Eyebrow>
          <div className="grid gap-5 md:grid-cols-3">
            {[["Small lawn", "up to 300 m²", "from €39.50/month"], ["Medium lawn", "301-600 m²", "from €49.50/month"], ["Large lawn", "601-1000 m²", "from €64.50/month"]].map(([name, size, price]) => (
              <MotionCard key={name}><Bot className="mb-4 h-8 w-8 text-fresh" /><h2 className="text-2xl font-black text-forest">{name}</h2><p className="mt-2 text-charcoal/70">{size}</p><p className="mt-5 text-3xl font-black text-forest">{price}</p></MotionCard>
            ))}
          </div>
        </Container>
      </Section>
      <Section id="calculator" className="bg-cream">
        <Container>
          <Eyebrow>Robot rental calculator</Eyebrow>
          <h2 className="mb-6 text-4xl font-black text-forest">Build your seasonal rental.</h2>
          <PricingCalculator initialTab="robot" />
        </Container>
      </Section>
      <Section className="bg-white">
        <Container>
          <Eyebrow>Buying vs renting</Eyebrow>
          <div className="overflow-hidden rounded-[30px] border border-forest/10 bg-white shadow-premium">
            <div className="grid grid-cols-3 bg-forest p-4 text-sm font-black text-white"><span>Topic</span><span>Buying</span><span>Renting</span></div>
            {rows.map((row) => <div key={row[0]} className="grid grid-cols-3 gap-3 border-t border-forest/10 p-4 text-sm"><strong className="text-forest">{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span></div>)}
          </div>
        </Container>
      </Section>
      <Section className="bg-cream">
        <Container>
          <Eyebrow>Robot rental FAQ</Eyebrow>
          <div className="grid gap-4 md:grid-cols-2">
            {["What happens if it rains?", "Do I need Wi-Fi?", "Is there a deposit?", "What if the mower is damaged?", "Can I buy it later?", "Is installation included?"].map((q) => (
              <div key={q} className="rounded-3xl bg-white p-5 shadow-sm"><CheckCircle2 className="mb-3 h-5 w-5 text-fresh" /><h3 className="font-black text-forest">{q}</h3><p className="mt-2 text-sm text-charcoal/70">Placeholder answer ready to customize for your exact rental policy.</p></div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
