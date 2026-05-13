import { serviceSections } from "@/lib/data";
import { ButtonLink, Container, Eyebrow, MotionCard, Section } from "@/components/ui";

export default function ServicesPage() {
  return (
    <Section className="bg-cream">
      <Container>
        <div className="mb-10 max-w-3xl">
          <Eyebrow>Season by season</Eyebrow>
          <h1 className="text-5xl font-black text-forest">Services for Every Season</h1>
          <p className="mt-4 text-lg leading-8 text-charcoal/70">Garden needs change throughout the year, so our services are organized by season for clear planning and fair pricing.</p>
        </div>
        <div className="grid gap-12">
          {serviceSections.map((section) => (
            <section key={section.title}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-forest">{section.title}</h2>
                  <p className="mt-2 text-charcoal/70">{section.intro}</p>
                </div>
                <ButtonLink href="/pricing">Estimate this season</ButtonLink>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map(([title, text, price, Icon]: any) => (
                  <MotionCard key={title}>
                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-lime text-forest"><Icon className="h-6 w-6" /></div>
                    <h3 className="text-xl font-black text-forest">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-charcoal/70">{text}</p>
                    <p className="mt-4 rounded-2xl bg-cream p-3 text-sm font-black text-forest">{price}</p>
                  </MotionCard>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
