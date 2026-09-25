import { LinkButton } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { LazyImage } from "../components/ui/LazyImage";
import { services } from "../../model/data";
import { usePageMeta } from "../../hooks/usePageMeta";

const IMG = {
  hero: {
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=85",
    srcSet: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80 800w",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=85 1400w",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=85 2000w",
    ].join(", "),
    lqip: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCA2Ij48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iNiIgZmlsbD0iIzFjMWMxZiIvPjwvc3ZnPg==",
  },
  fade: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80",
  interior: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1400&q=85",
};

const TESTIMONIALS = [
  { quote: "Premium without feeling precious.", name: "Daniel R.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
  { quote: "Easy booking, warm service and a fade that stayed sharp.", name: "Lerato K.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
  { quote: "The small details are the whole point.", name: "Thabo M.", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
];

export function HomePage() {
  usePageMeta({
    title: "Iron & Oak — Barbershop in Rosebank, Johannesburg",
    description:
      "Considered cuts, clean craft and a calm chair. Book your next appointment at Iron & Oak in Rosebank, Johannesburg.",
    canonical: "https://iron-oak.example/",
  });

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <LazyImage
            priority
            src={IMG.hero.src}
            srcSet={IMG.hero.srcSet}
            sizes="100vw"
            alt=""
            width={1800}
            height={1000}
            className="h-full w-full rounded-none"
            imgClassName="object-cover"
            lqip={IMG.hero.lqip}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0E0E10_10%,rgba(14,14,16,0.85)_55%,rgba(14,14,16,0.3))]" />
        </div>

        <div className="container-x flex min-h-[640px] items-end pb-20 pt-32 md:min-h-[720px] md:pb-28">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow">Rosebank · Johannesburg</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-4 text-display font-display">
                Sharp where it matters.<br />
                <span className="text-brass">Easy everywhere else.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-body-lg text-slate-300">
                Considered cuts, clean craft and a calm chair. Book your next appointment in under a minute.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton to="/booking" size="lg" iconRight="→">Book an appointment</LinkButton>
                <LinkButton to="/services" size="lg" variant="secondary">Explore services</LinkButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section-y">
        <div className="container-x">
          <Reveal><span className="eyebrow">The menu</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 max-w-2xl text-h2">Good cuts, no clutter.</h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((s, i) => (
              <Reveal key={s.id} delay={0.08 + i * 0.05}>
                <article className="surface group h-full p-6 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-brass/40">
                  <span className="text-micro uppercase tracking-wider text-brass">{s.category}</span>
                  <h3 className="mt-2 text-h4">{s.name}</h3>
                  <p className="mt-2 text-body-sm text-slate-300">{s.description}</p>
                  <p className="mt-4 text-body-sm font-semibold text-cream">R{s.price} · {s.duration} min</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-10">
              <LinkButton to="/services" variant="secondary">View full menu</LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT / IMAGE SPLIT */}
      <section className="section-y bg-charcoal/40">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <LazyImage
              src={IMG.interior}
              srcSet={`${IMG.interior}&w=800 800w, ${IMG.interior}&w=1400 1400w`}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt="Inside the Iron & Oak barbershop — brass fittings, warm light and leather chairs"
              width={1400}
              height={1000}
              className="rounded-3xl"
            />
          </Reveal>
          <div>
            <Reveal><span className="eyebrow">Our craft</span></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-3 text-h2">A calmer kind of barbershop.</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 text-body text-slate-300">
                Every appointment is a small, deliberate ritual — clean tools, a warm towel and a barber who listens.
                No rush, no fuss, no upselling.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8">
                <LinkButton to="/about" variant="secondary">Read our story</LinkButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-y">
        <div className="container-x">
          <Reveal><span className="eyebrow">Kind words</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 text-h2">Leave sharper than you arrived.</h2>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={0.08 + i * 0.06}>
                <blockquote className="surface h-full p-6">
                  <p className="font-display text-[22px] leading-snug text-cream">“{t.quote}”</p>
                  <footer className="mt-5 flex items-center gap-3">
                    <LazyImage
                      src={t.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <cite className="text-caption not-italic text-slate-400">— {t.name}</cite>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y bg-charcoal/40">
        <div className="container-x">
          <Reveal>
            <div className="surface flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-12">
              <div>
                <h2 className="text-h3">Ready for a proper cut?</h2>
                <p className="mt-2 text-body text-slate-300">
                  Pick a service, choose a barber and lock in a time — in under a minute.
                </p>
              </div>
              <LinkButton to="/booking" size="lg">Book Now</LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}