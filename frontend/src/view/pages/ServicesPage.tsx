import { LinkButton } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { LazyImage } from "../components/ui/LazyImage";
import { services } from "../../model/data";
import { usePageMeta } from "../../hooks/usePageMeta";

const CATEGORY_IMG: Record<string, string> = {
  Haircuts: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
  Fades:    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
  Beard:    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
  Packages: "https://images.unsplash.com/photo-1521490878406-49423787c4a3?auto=format&fit=crop&w=800&q=80",
  Kids:     "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80",
};

export function ServicesPage() {
  usePageMeta({
    title: "Services & Pricing — Iron & Oak Barbershop",
    description:
      "Transparent pricing for haircuts, skin fades, beard sculpts, packages and kids cuts at Iron & Oak in Rosebank.",
    canonical: "https://iron-oak.example/services",
  });

  return (
    <section className="section-y">
      <div className="container-x">
        <Reveal><span className="eyebrow">Services &amp; pricing</span></Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-h1">Everything you need.<br />Nothing you don’t.</h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-2xl text-body-lg text-slate-300">
            Transparent pricing, clear durations and a simple booking flow.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={0.06 + (i % 3) * 0.05}>
              <article className="surface group flex h-full flex-col overflow-hidden">
                <LazyImage
                  src={CATEGORY_IMG[s.category]}
                  alt={`${s.name} — ${s.category}`}
                  width={800}
                  height={600}
                  className="rounded-none"
                  imgClassName="transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
                />
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-micro uppercase tracking-wider text-brass">{s.category}</span>
                  <h2 className="mt-2 text-h4">{s.name}</h2>
                  <p className="mt-2 text-body-sm text-slate-300">{s.description}</p>
                  <div className="mt-auto pt-5 flex items-center justify-between">
                    <span className="text-body-sm font-semibold text-cream">
                      R{s.price} · {s.duration} min
                    </span>
                    <LinkButton to={`/booking?service=${s.id}`} size="sm" variant="secondary">
                      Book
                    </LinkButton>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 surface p-8 text-center">
            <h2 className="text-h3">Not sure which to pick?</h2>
            <p className="mt-2 text-body text-slate-300">
              Book the signature Cut + Beard package — our most popular choice.
            </p>
            <div className="mt-6 flex justify-center">
              <LinkButton to="/booking?service=combo" size="lg">Book Cut + Beard</LinkButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}