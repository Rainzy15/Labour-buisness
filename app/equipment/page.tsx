import { equipment } from "@/lib/data";
import { Container, Eyebrow, MotionCard, Section } from "@/components/ui";

const groups = [
  ["Lawn care tools", ["Lawn mower", "Strimmer / edge trimmer", "Blower and rake", "Green waste bags"]],
  ["Hedge care tools", ["Hedge trimmer", "Ladder", "Safety gloves", "Protective eyewear"]],
  ["Pressure washing tools", ["Pressure washer", "Surface cleaner attachment", "Eco cleaning option"]],
  ["Winter tools", ["Snow shovel and salt spreader", "De-icing salt", "Safety equipment"]]
];

export default function EquipmentPage() {
  return (
    <Section className="bg-cream">
      <Container>
        <div className="mb-10 max-w-3xl">
          <Eyebrow>Professional tools</Eyebrow>
          <h1 className="text-4xl font-black text-forest sm:text-5xl">Equipment We Use</h1>
          <p className="mt-4 text-lg leading-8 text-charcoal/70">Practical, reliable equipment for clean finishes across lawn care, hedges, terrace cleaning, and winter visits.</p>
        </div>
        <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {groups.map(([title, items]: any) => (
            <div key={title} className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="font-black text-forest">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-charcoal/70">{items.join(" · ")}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {equipment.map(([name, description, tags, image]: any) => (
            <MotionCard key={name} className="overflow-hidden p-0">
              <img src={image} alt={`${name} used by LuxLawn Care`} className="h-56 w-full object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-black text-forest">{name}</h2>
                <p className="mt-2 text-sm leading-6 text-charcoal/70">{description}</p>
                <div className="mt-4 flex flex-wrap gap-2">{tags.map((tag: string) => <span key={tag} className="rounded-full bg-cream px-3 py-1 text-xs font-black text-forest">Used for {tag}</span>)}</div>
              </div>
            </MotionCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
