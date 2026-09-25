import { useState, useCallback, useMemo, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, LinkButton } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { Modal } from "../components/ui/Modal";
import { useBookingViewModel } from "../../viewmodel/useBookingViewModel";
import { bookingDetailsSchema } from "../../model/schemas";
import { googleCalendarUrl, outlookCalendarUrl } from "../../lib/calendar";
import { downloadIcs } from "../../lib/ics";
import { useToast } from "../components/ui/Toast";
import { usePageMeta } from "../../hooks/usePageMeta";
import { api } from "../../lib/api";
import type { BookingCustomer } from "../../model/types";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STEP_ORDER = ["Service", "Barber", "Date", "Time", "Details"] as const;

const BARBER_IMG: Record<string, string> = {
  miles:
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=facearea&facepad=3&w=400&h=400&q=80",
  noah:
    "https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=facearea&facepad=3&w=400&h=400&q=80",
  zin:
    "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=facearea&facepad=3&w=400&h=400&q=80",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function BookingPage() {
  const vm = useBookingViewModel();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const toast = useToast();

  usePageMeta({
    title: "Book an appointment — Iron & Oak Barbershop",
    description:
      "Book your next cut, fade, beard sculpt or package at Iron & Oak in Rosebank, Johannesburg.",
    canonical: "https://iron-oak.example/booking",
  });

  /* ---------------- URL param: pre-select service ---------------- */
  const presetId = params.get("service");
  useMemo(() => {
    if (!presetId) return;
    const found = vm.services.find((s) => s.id === presetId);
    if (found && vm.service.id !== found.id) vm.setService(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetId]);

  /* ---------------- Step tracking ---------------- */
  const currentIndex = !vm.barber
    ? 0
    : !vm.date
    ? 1
    : !vm.time
    ? 2
    : !vm.booking
    ? 3
    : 4;

  /* ---------------- End time preview ---------------- */
  const endTimePreview = useMemo(() => {
    if (!vm.time) return "";
    const [h, m] = vm.time.split(":").map(Number);
    const total = h * 60 + m + vm.service.duration;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
      total % 60
    ).padStart(2, "0")}`;
  }, [vm.time, vm.service.duration]);

  /* ---------------- Submit ---------------- */
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = bookingDetailsSchema.safeParse(data);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check your details.";
      setError(message);
      toast.push({
        variant: "error",
        title: "Check your details",
        description: message,
      });
      return;
    }

    const customer: BookingCustomer = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      notes: parsed.data.notes ?? "",
    };

    try {
      const booking = await api.bookings.create({
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        serviceId: vm.service.id,
        barberId: vm.barber?.id,
        bookingDate: vm.date,
        startTime: vm.time,
        notes: customer.notes,
        consent: true,
      });

      vm.confirmWithServer(customer, {
        reference: booking.reference,
        start: booking.startTime,
        end: booking.endTime,
      });

      toast.push({
        variant: "success",
        title: "Booking confirmed",
        description: `Reference ${booking.reference}. Add it to your calendar below.`,
      });
      setConfirmModalOpen(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Booking failed";
      const isNetworkError =
        message.toLowerCase().includes("failed to fetch") ||
        message.toLowerCase().includes("network");

      if (isNetworkError) {
        vm.confirm(customer);
        toast.push({
          variant: "warning",
          title: "Booking saved locally",
          description:
            "We couldn't reach the server, so we've shown you a local confirmation. Please call to confirm.",
        });
        setConfirmModalOpen(true);
      } else {
        setError(message);
        toast.push({
          variant: "error",
          title: "Booking failed",
          description: message,
        });
      }
    }
  }

  /* ---------------- ICS download ---------------- */
  const handleIcsDownload = useCallback(() => {
    if (!vm.booking) return;
    try {
      downloadIcs(vm.booking);
      toast.push({
        variant: "info",
        title: "Calendar file downloaded",
        description: "Open it to add to Apple Calendar.",
      });
    } catch {
      toast.push({
        variant: "error",
        title: "Could not download calendar file",
      });
    }
  }, [vm.booking, toast]);

  /* ---------------- Reset booking ---------------- */
  const handleBookAnother = useCallback(() => {
    vm.reset();
    setConfirmModalOpen(false);
    setError(null);
  }, [vm]);

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <section className="section-y">
      <div className="container-x max-w-3xl">
        <Reveal>
          <span className="eyebrow">Appointments</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-h1">Book your chair.</h1>
        </Reveal>

        {/* ---------------- Stepper ---------------- */}
        <Reveal delay={0.1}>
          <ol
            className="mt-10 flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
            aria-label="Booking progress"
          >
            {STEP_ORDER.map((label, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <li
                  key={label}
                  aria-current={active ? "step" : undefined}
                  className={[
                    "shrink-0 rounded-full px-3.5 py-1.5 text-micro font-semibold uppercase tracking-wider transition-colors",
                    done
                      ? "bg-brass/15 text-brass"
                      : active
                      ? "bg-brass text-ink"
                      : "bg-white/[0.05] text-slate-400",
                  ].join(" ")}
                >
                  {i + 1}. {label}
                </li>
              );
            })}
          </ol>
        </Reveal>

        <div className="mt-10">
          {/* ---------------- STEP 1 — SERVICE ---------------- */}
          {!vm.barber && (
            <Reveal>
              <h2 className="text-h3">Choose a service</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {vm.services.map((s) => {
                  const selected = s.id === vm.service.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => vm.setService(s)}
                      aria-pressed={selected}
                      className={[
                        "surface p-5 text-left transition-all duration-200 ease-out-expo hover:border-brass/40 hover:-translate-y-0.5",
                        selected ? "border-brass ring-1 ring-brass/40" : "",
                      ].join(" ")}
                    >
                      <span className="text-micro uppercase tracking-wider text-brass">
                        {s.category}
                      </span>
                      <h3 className="mt-1 text-h4">{s.name}</h3>
                      <p className="mt-1 text-body-sm text-slate-300">
                        {s.description}
                      </p>
                      <p className="mt-3 text-body-sm font-semibold text-cream">
                        R{s.price} · {s.duration} min
                      </p>
                    </button>
                  );
                })}
              </div>
            </Reveal>
          )}

          {/* ---------------- STEP 2 — BARBER ---------------- */}
          {!vm.barber && vm.service && (
            <Reveal delay={0.05}>
              <div className="mt-12">
                <h2 className="text-h3">Choose your barber</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {vm.barbers.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => vm.setBarber(b)}
                      className="surface flex items-center gap-4 p-4 text-left transition-all duration-200 ease-out-expo hover:border-brass/40 hover:-translate-y-0.5"
                    >
                      <img
                        src={BARBER_IMG[b.id]}
                        alt=""
                        width={56}
                        height={56}
                        loading="lazy"
                        decoding="async"
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-h4">{b.name}</h3>
                        <p className="text-body-sm text-brass">{b.role}</p>
                        <p className="mt-0.5 text-body-sm text-slate-300">
                          {b.specialties.join(" · ")}
                        </p>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => vm.setBarber(null)}
                    className="surface flex items-center gap-4 p-4 text-left transition-all duration-200 ease-out-expo hover:border-brass/40 hover:-translate-y-0.5"
                  >
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brass/15 font-display text-h4 text-brass">
                      ✦
                    </span>
                    <div>
                      <h3 className="text-h4">Any available</h3>
                      <p className="text-body-sm text-slate-300">
                        We'll match you with the next available barber.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </Reveal>
          )}

          {/* ---------------- STEP 3 — DATE ---------------- */}
          {vm.barber !== undefined && vm.date === "" && (
            <Reveal delay={0.05}>
              <div className="mt-12">
                <h2 className="text-h3">Pick a date</h2>
                <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {vm.dates.map((d) => {
                    const iso = d.toISOString().slice(0, 10);
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => vm.setDate(iso)}
                        className="surface p-4 text-center transition-all duration-200 ease-out-expo hover:border-brass/40 hover:-translate-y-0.5"
                      >
                        <div className="text-micro uppercase tracking-wider text-slate-400">
                          {d.toLocaleDateString("en-ZA", { weekday: "short" })}
                        </div>
                        <div className="mt-1 font-display text-h3 leading-none">
                          {d.getDate()}
                        </div>
                        <div className="mt-1 text-caption text-slate-400">
                          {d.toLocaleDateString("en-ZA", { month: "short" })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          )}

          {/* ---------------- STEP 4 — TIME ---------------- */}
          {vm.date && !vm.time && (
            <Reveal delay={0.05}>
              <div className="mt-12">
                <h2 className="text-h3">Pick a time</h2>
                <p className="mt-2 text-body-sm text-slate-400">
                  Times shown in Africa/Johannesburg (GMT+2). Duration:{" "}
                  {vm.service.duration} min.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {vm.times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => vm.setTime(t)}
                      className="surface px-3 py-3 text-body-sm transition-colors hover:border-brass/40 hover:text-brass"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* ---------------- STEP 5 — DETAILS ---------------- */}
          {vm.date && vm.time && !vm.booking && (
            <Reveal delay={0.05}>
              <form
                onSubmit={submit}
                className="surface relative mt-12 grid gap-4 p-6 sm:p-8"
                noValidate
              >
                <h2 className="text-h3">Your details</h2>
                <p className="text-body-sm text-slate-300">
                  {vm.service.name} · {vm.date} · {vm.time}–{endTimePreview} · R
                  {vm.service.price}
                  {vm.barber ? ` · ${vm.barber.name}` : ""}
                </p>

                <label className="grid gap-2">
                  <span className="text-caption font-medium text-slate-300">
                    Full name
                  </span>
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={60}
                    className="h-11 rounded-xl border border-white/10 bg-ink/60 px-4 text-body text-cream placeholder:text-slate-500 focus:border-brass focus:outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-caption font-medium text-slate-300">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    maxLength={120}
                    className="h-11 rounded-xl border border-white/10 bg-ink/60 px-4 text-body text-cream focus:border-brass focus:outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-caption font-medium text-slate-300">
                    Phone
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    minLength={7}
                    maxLength={25}
                    placeholder="+27 71 234 5678"
                    className="h-11 rounded-xl border border-white/10 bg-ink/60 px-4 text-body text-cream focus:border-brass focus:outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-caption font-medium text-slate-300">
                    Notes (optional)
                  </span>
                  <textarea
                    name="notes"
                    maxLength={500}
                    rows={4}
                    className="rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-body text-cream focus:border-brass focus:outline-none"
                  />
                </label>

                <label className="flex items-start gap-3 text-body-sm text-slate-300">
                  <input
                    name="consent"
                    type="checkbox"
                    value="true"
                    required
                    className="mt-1 h-4 w-4 accent-[color:var(--brass,#C9A227)]"
                  />
                  <span>
                    I agree to the{" "}
                    <Link to="/terms" className="link-brass">
                      booking terms
                    </Link>
                    .
                  </span>
                </label>

                {/* Honeypot */}
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                {error && (
                  <p role="alert" className="text-body-sm text-danger">
                    {error}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-3">
                  <Button type="submit" size="lg" loading={vm.submitting}>
                    Confirm booking
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => vm.setTime("")}
                    disabled={vm.submitting}
                  >
                    Change time
                  </Button>
                </div>
              </form>
            </Reveal>
          )}

          {/* ---------------- STEP 6 — CONFIRMATION (inline) ---------------- */}
          {vm.booking && (
            <Reveal>
              <div className="surface mt-12 p-6 text-center sm:p-8">
                <span className="eyebrow">Confirmed</span>
                <h2 className="mt-3 text-h2">See you in the chair.</h2>
                <p className="mt-3 text-body text-slate-300">
                  {vm.booking.service.name} · {vm.booking.date} ·{" "}
                  {vm.booking.start}–{vm.booking.end}
                  {vm.booking.barber ? ` · ${vm.booking.barber.name}` : ""}
                </p>
                <p className="mt-2 text-body-sm text-brass">
                  Reference: {vm.booking.reference}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    className="inline-flex h-11 items-center rounded-full bg-brass px-5 text-body-sm font-semibold text-ink transition hover:bg-brass-400"
                    href={googleCalendarUrl(vm.booking)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Add to Google Calendar
                  </a>
                  <button
                    type="button"
                    className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-body-sm font-semibold text-cream transition hover:bg-white/5"
                    onClick={handleIcsDownload}
                  >
                    Apple / .ics
                  </button>
                  <a
                    className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-body-sm font-semibold text-cream transition hover:bg-white/5"
                    href={outlookCalendarUrl(vm.booking)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Outlook
                  </a>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <LinkButton to="/" variant="ghost" size="sm">
                    Back to home
                  </LinkButton>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBookAnother}
                  >
                    Book another
                  </Button>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* ---------------- CONFIRMATION MODAL ---------------- */}
      <Modal
        open={confirmModalOpen && !!vm.booking}
        onClose={() => setConfirmModalOpen(false)}
        title="Booking confirmed"
        description="Add it to your calendar so you don't miss it."
        size="md"
      >
        {vm.booking && (
          <div className="grid gap-4">
            <div className="rounded-xl border border-brass/30 bg-brass/5 p-4">
              <p className="text-body text-cream">
                {vm.booking.service.name}
                {vm.booking.barber ? ` with ${vm.booking.barber.name}` : ""}
              </p>
              <p className="mt-1 text-body-sm text-slate-300">
                {vm.booking.date} · {vm.booking.start}–{vm.booking.end}
              </p>
              <p className="mt-2 text-body-sm text-brass">
                Reference: {vm.booking.reference}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                className="inline-flex h-10 items-center rounded-full bg-brass px-4 text-body-sm font-semibold text-ink transition hover:bg-brass-400"
                href={googleCalendarUrl(vm.booking)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Calendar
              </a>
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-body-sm font-semibold text-cream transition hover:bg-white/5"
                onClick={handleIcsDownload}
              >
                Apple / .ics
              </button>
              <a
                className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-body-sm font-semibold text-cream transition hover:bg-white/5"
                href={outlookCalendarUrl(vm.booking)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Outlook
              </a>
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setConfirmModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

export default BookingPage;