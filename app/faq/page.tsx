import { FaqAccordion } from "@/components/FaqAccordion";
import { faqs } from "@/lib/data";
import { Container, Eyebrow, Section } from "@/components/ui";

export default function FaqPage() {
  return (
    <Section className="bg-cream">
      <Container>
        <div className="mb-10 max-w-3xl">
          <Eyebrow>Answers</Eyebrow>
          <h1 className="text-4xl font-black text-forest sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg leading-8 text-charcoal/70">Clear answers for pricing, lawn care, hedge work, winter visits, and bookings.</p>
        </div>
        <FaqAccordion groups={faqs} />
      </Container>
    </Section>
  );
}
