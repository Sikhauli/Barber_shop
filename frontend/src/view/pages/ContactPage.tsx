import { Reveal } from "../components/Reveal";
import { Button } from "../components/Button";
import { useToast } from "../components/ui/Toast";
import { usePageMeta } from "../../hooks/usePageMeta";
import { openingHours } from "../../model/data";

export function ContactPage() {
  const toast = useToast();

  usePageMeta({
    title: "Contact & Directions — Iron & Oak Barbershop",
    description:
      "Visit Iron & Oak Barbershop at 24 Keyes Avenue, Rosebank, Johannesburg. Call +27 11 555 0148 or send us a message.",
    canonical: "https://iron-oak.example/contact",
  });

  return (
    <section className="section-y">
      <div className="container-x">
        <Reveal><span className="eyebrow">Contact</span></Reveal>
        <Reveal delay={0.05}><h1 className="mt-3 text-h1">Come say hello.</h1></Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Info + map */}
          <Reveal delay={0.08}>
            <div className="surface p-6 sm:p-8">
              <h2 className="text-h4">Visit</h2>
              <address className="mt-3 not-italic text-body text-slate-300">
                24 Keyes Avenue<br />
                Rosebank, Johannesburg, 2196
              </address>
              <p className="mt-3 text-body">
                <a className="link-brass" href="tel:+27115550148">+27 11 555 0148</a>
                <br />
                <a className="link-brass" href="mailto:hello@iron-oak.example">hello@iron-oak.example</a>
              </p>

              <h3 className="mt-8 text-h4">Hours</h3>
              <ul className="mt-3 space-y-1.5 text-body-sm">
                {openingHours.map(([day, hrs]) => (
                  <li key={day} className="flex justify-between gap-4 text-slate-300">
                    <span>{day}</span>
                    <span className={hrs === "Closed" ? "text-slate-500" : "text-cream/90"}>{hrs}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  title="Map of Iron & Oak Barbershop, Rosebank, Johannesburg"
                  src="https://www.google.com/maps?q=Rosebank%20Johannesburg&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  className="h-[280px] w-full border-0"
                />
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.14}>
            <form
              className="surface grid gap-4 p-6 sm:p-8"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = Object.fromEntries(new FormData(form));
                if (!data.name || !data.email || !data.message) {
                  toast.push({ variant: "error", title: "Please fill in every field" });
                  return;
                }
                toast.push({
                  variant: "success",
                  title: "Message sent",
                  description: "We'll get back to you within one business day.",
                });
                form.reset();
              }}
            >
              <h2 className="text-h4">Send a note.</h2>

              <label className="grid gap-2">
                <span className="text-caption font-medium text-slate-300">Name</span>
                <input
                  name="name" required maxLength={60} autoComplete="name"
                  className="h-11 rounded-xl border border-white/10 bg-ink/60 px-4 text-body text-cream focus:border-brass focus:outline-none"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-caption font-medium text-slate-300">Email</span>
                <input
                  name="email" type="email" required maxLength={120} autoComplete="email" inputMode="email"
                  className="h-11 rounded-xl border border-white/10 bg-ink/60 px-4 text-body text-cream focus:border-brass focus:outline-none"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-caption font-medium text-slate-300">Message</span>
                <textarea
                  name="message" required maxLength={1000} rows={5}
                  className="rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-body text-cream focus:border-brass focus:outline-none"
                />
              </label>

              <Button type="submit" size="lg">Send message</Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}