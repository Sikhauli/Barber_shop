import { LinkButton } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { usePageMeta } from "../../hooks/usePageMeta";

export function NotFoundPage() {
  usePageMeta({
    title: "Page not found — Iron & Oak Barbershop",
    description: "The page you were looking for doesn't exist. Head back to Iron & Oak.",
  });

  return (
    <section className="section-y">
      <div className="container-x max-w-2xl text-center">
        <Reveal><span className="eyebrow">404</span></Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-h1">Wrong chair.</h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-4 text-body-lg text-slate-300">
            That page doesn’t exist. Let’s get you back to the right spot.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-8 flex justify-center gap-3">
            <LinkButton to="/" size="lg">Back home</LinkButton>
            <LinkButton to="/booking" size="lg" variant="secondary">Book an appointment</LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}