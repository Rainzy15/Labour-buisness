import { ContactForm } from "@/components/ContactForm";
import { Container, Eyebrow, Section } from "@/components/ui";

export default function ContactPage() {
  return (
    <Section className="bg-cream">
      <Container className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <Eyebrow>Contact / booking</Eyebrow>
          <h1 className="text-4xl font-black text-forest sm:text-5xl">Book a visit or request a final quote.</h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/70">Send us your garden size, commune, preferred date, and a few photos. We'll use your details to turn the online estimate into a practical quote.</p>
          <div className="mt-6 rounded-[28px] bg-white p-5 shadow-sm">
            <h2 className="font-black text-forest">Quote summary placeholder</h2>
            <p className="mt-2 text-sm text-charcoal/70">If connected later, this area can show the services added from the pricing basket.</p>
          </div>
        </div>
        <ContactForm />
      </Container>
    </Section>
  );
}
