import { Reveal } from "../components/Reveal";
import { LazyImage } from "../components/ui/LazyImage";
import { LinkButton } from "../components/Button";
import { barbers } from "../../model/data";
import { usePageMeta } from "../../hooks/usePageMeta";

const BARBER_IMG: Record<string, string> = {
  miles: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=facearea&facepad=3&w=600&h=800&q=80",
  noah:  "https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=facearea&facepad=3&w=600&h=800&q=80",
  zin:   "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=facearea&facepad=3&w=600&h=800&q=80",
};

export function AboutPage() {
  usePageMeta({
    title: "About — Iron & Oak Barbershop, Rosebank",
    description:
      "The story behind Iron & Oak — a modern neighbourhood barbershop built on clean craft, warm chairs and careful attention.",
    canonical: "https://iron-oak.example/about",
  });

  return (
    <>
      <section className="section-y">
        <div className="container-x">
          <Reveal><span className="eyebrow">Our story</span></Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-3 max-w-4xl text-h1">
              A better barbershop is a small thing with a big effect.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-body-lg text-slate-300">
              Iron &amp; Oak was built around one idea: the appointment should feel as considered as the haircut.
              Craft is serious, conversation is optional, and every guest gets the same attention to detail.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-charcoal/40">
        <div className="container-x">
          <Reveal><span className="eyebrow">The team</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 text-h2">Meet your barbers.</h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {barbers.map((b, i) => (
              <Reveal key={b.id} delay={0.08 + i * 0.06}>
                <article className="surface overflow-hidden">
                  <LazyImage
                    src={BARBER_IMG[b.id]}
                    alt={`Portrait of ${b.name}, ${b.role}`}
                    width={600}
                    height={800}
                    className="rounded-none"
                  />
                  <div className="p-6">
                    <span className="text-micro uppercase tracking-wider text-brass">{b.role}</span>
                    <h3 className="mt-2 text-h4">{b.name}</h3>
                    <p className="mt-2 text-body-sm text-slate-300">{b.specialties.join(" · ")}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-12 flex justify-center">
              <LinkButton to="/booking" size="lg">Book with a barber</LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <Reveal><span className="eyebrow">Our values</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 text-h2">Three things we never skip.</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { t: "Craft", d: "Sharp lines, clean tools and a finish that holds up past week one." },
              { t: "Calm", d: "No rush, no upselling — just a quiet chair and a barber who listens." },
              { t: "Care", d: "Hot towels, cold drinks and a team that remembers your name." },
            ].map((v, i) => (
              <Reveal key={v.t} delay={0.08 + i * 0.06}>
                <div className="surface h-full p-6">
                  <h3 className="text-h4">{v.t}</h3>
                  <p className="mt-2 text-body-sm text-slate-300">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}