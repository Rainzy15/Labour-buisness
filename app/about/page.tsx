import { areas } from "@/lib/data";
import { ButtonLink, Container, Eyebrow, MotionCard, Section } from "@/components/ui";

export default function AboutPage() {
  const values = ["Fair pricing", "Clear communication", "Reliable visits", "Clean work", "Respect for property", "Seasonal thinking"];
  return (
    <>
      <Section className="bg-cream">
        <Container className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>Luxembourg-based</Eyebrow>
            <h1 className="text-4xl font-black text-forest sm:text-5xl">Young, local, and serious about clear garden care.</h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/70">Garden care in Luxembourg can feel expensive and unclear. LuxLawn Care is built around transparent online estimates, flexible seasonal care, and tidy work that respects your property.</p>
            <div className="mt-7"><ButtonLink href="/contact">Send garden details</ButtonLink></div>
          </div>
          <div className="min-h-[440px] rounded-[36px] bg-[linear-gradient(rgba(18,61,42,.2),rgba(18,61,42,.2)),url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center shadow-premium" />
        </Container>
      </Section>
      <Section className="bg-white">
        <Container>
          <Eyebrow>Our values</Eyebrow>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((value) => <MotionCard key={value}><h2 className="text-2xl font-black text-forest">{value}</h2><p className="mt-2 text-sm leading-6 text-charcoal/70">Simple standards that make every visit easier to trust and easier to book again.</p></MotionCard>)}
          </div>
        </Container>
      </Section>
      <Section className="bg-cream">
        <Container>
          <Eyebrow>Where we work</Eyebrow>
          <h2 className="text-4xl font-black text-forest">Local service areas across Luxembourg.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {areas.map((area) => <div key={area} className="rounded-2xl bg-white p-4 text-sm font-black text-forest shadow-sm">{area}</div>)}
          </div>
          <div className="mt-8 rounded-[34px] border border-forest/10 bg-white p-8 shadow-premium">
            <h3 className="text-2xl font-black text-forest">Service area map placeholder</h3>
            <p className="mt-2 text-charcoal/70">Replace this with a Google Map or custom Luxembourg coverage map when the business address and radius are final.</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
