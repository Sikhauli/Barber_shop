import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "../components/Logo";
import { LinkButton } from "../components/Button";
import { PromoPopup } from "../components/PromoPopup";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { cn } from "../../lib/cn";
import { openingHours } from "../../model/data";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useLockBodyScroll(open);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brass focus:px-4 focus:py-2 focus:text-ink focus:font-semibold"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl">
        <div className="container-x flex h-[76px] items-center justify-between">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {NAV.map(({ to, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "relative text-micro font-semibold uppercase tracking-widest transition-colors",
                    active ? "text-cream" : "text-slate-300 hover:text-cream"
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 right-0 mx-auto h-px origin-center bg-brass transition-transform duration-300 ease-out-expo",
                      active ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <LinkButton to="/booking" size="md">Book Now</LinkButton>
          </div>

          <button
            type="button"
            className="rounded-full p-2 text-cream transition hover:bg-white/5 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div id="mobile-nav" className="border-t border-white/[0.06] bg-ink animate-fade-in md:hidden">
            <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-6">
              {NAV.map(({ to, label }, i) => (
                <Link
                  key={to}
                  to={to}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={cn(
                    "animate-fade-up rounded-xl px-3 py-3 text-body font-medium transition-colors",
                    pathname === to
                      ? "bg-white/[0.04] text-cream"
                      : "text-slate-300 hover:bg-white/[0.04] hover:text-cream"
                  )}
                >
                  {label}
                </Link>
              ))}
              <LinkButton to="/booking" size="lg" className="mt-3 w-full">Book Now</LinkButton>
            </nav>
          </div>
        )}
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="border-t border-white/[0.06] bg-charcoal/40">
        <div className="container-x grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-body-sm text-slate-300">
              Considered cuts. Clean craft. A modern neighbourhood barbershop in Rosebank.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
                { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-white/10 p-2.5 text-slate-300 transition hover:border-brass/50 hover:text-brass"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-micro font-bold uppercase tracking-eyebrow text-brass">Explore</h3>
            <ul className="mt-4 space-y-2 text-body-sm">
              {NAV.map(({ to, label }) => (
                <li key={to}><Link to={to} className="link-quiet">{label}</Link></li>
              ))}
              <li><Link to="/booking" className="link-quiet">Book Now</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-micro font-bold uppercase tracking-eyebrow text-brass">Visit</h3>
            <ul className="mt-4 space-y-3 text-body-sm text-slate-300">
              <li className="flex gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brass/70" aria-hidden />
                24 Keyes Avenue, Rosebank, Johannesburg, 2196
              </li>
              <li className="flex gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-brass/70" aria-hidden />
                <a className="link-quiet" href="tel:+27115550148">+27 11 555 0148</a>
              </li>
              <li className="flex gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-brass/70" aria-hidden />
                <a className="link-quiet" href="mailto:hello@iron-oak.example">hello@iron-oak.example</a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-micro font-bold uppercase tracking-eyebrow text-brass">Hours</h3>
            <ul className="mt-4 space-y-1.5 text-body-sm">
              {openingHours.map(([day, hrs]) => (
                <li key={day} className="flex justify-between gap-4 text-slate-300">
                  <span>{day}</span>
                  <span className={hrs === "Closed" ? "text-slate-500" : "text-cream/90"}>{hrs}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06]">
          <div className="container-x flex flex-col gap-3 py-5 text-nano text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Iron &amp; Oak Barbershop. All rights reserved.</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              <li><Link className="transition hover:text-cream" to="/terms">Terms &amp; Conditions</Link></li>
              <li><Link className="transition hover:text-cream" to="/privacy">Privacy Policy</Link></li>
              <li>
                <a
                  className="transition hover:text-cream"
                  href="https://maps.google.com/?q=Rosebank+Johannesburg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Directions
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      <PromoPopup />
    </>
  );
}