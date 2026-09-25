import { Reveal } from "../components/Reveal";
import { usePageMeta } from "../../hooks/usePageMeta";

const CONTENT = {
  terms: [
    ["Booking & cancellation", "Appointments may be cancelled or moved without charge with at least 24 hours' notice. Cancellations within 24 hours and no-shows may incur a fee of up to 50% of the booked service. Bookings are confirmed by email or SMS."],
    ["Deposits & refunds", "Where a deposit is taken, it is applied to the final price of the appointment. Deposits are refundable when cancellation is made with 24 hours' notice. Refunds are processed to the original payment method within 5 business days."],
    ["Late arrival", "Guests arriving more than 10 minutes late may receive a shortened service to protect the next appointment. Full price still applies."],
    ["Pricing & payment", "Prices are shown in South African Rand and include VAT where applicable. We accept cash, card and approved digital wallets in-store."],
    ["Health & safety", "Please disclose relevant allergies, skin conditions or sensitivities before your service. Tools are sanitised between every guest."],
    ["Minors", "Guests under 12 must be accompanied by a parent or responsible guardian for the duration of the appointment."],
    ["Liability", "Nothing in these terms excludes liability that cannot legally be excluded under South African law."],
    ["Complaints", "Please contact us within 7 days at hello@iron-oak.example and we will respond within 5 business days."],
    ["Governing law", "These terms are governed by the laws of the Republic of South Africa."],
    ["Contact", "hello@iron-oak.example · +27 11 555 0148"],
  ],
  privacy: [
    ["Information we collect", "We collect information you provide when booking or contacting us: name, email, phone, selected service, appointment time, and any optional notes."],
    ["How we use it", "To arrange appointments, answer enquiries, maintain operational records and prevent abuse. We do not sell customer information."],
    ["Legal basis", "We process personal information under POPIA on the basis of contract performance, legitimate interest, and consent where required."],
    ["Sharing", "We share data only with service providers essential to operating the shop (payment, scheduling, communications) under confidentiality obligations."],
    ["Retention", "Booking drafts are stored only in your browser's session storage and cleared when you close the tab. Confirmed bookings are retained as required for operational and legal records."],
    ["Your rights", "You may request access, correction or deletion of your personal information by contacting hello@iron-oak.example."],
    ["Cookies", "We use no third-party tracking cookies. Session storage is used only for the booking flow."],
    ["Security", "We apply reasonable technical and organisational measures to protect your information."],
    ["Contact", "hello@iron-oak.example · +27 11 555 0148"],
  ],
} as const;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

export function LegalPage({ kind }: { kind: "terms" | "privacy" }) {
  const isTerms = kind === "terms";
  const sections = CONTENT[kind];

  usePageMeta({
    title: isTerms ? "Terms & Conditions — Iron & Oak Barbershop" : "Privacy Policy — Iron & Oak Barbershop",
    description: isTerms
      ? "Booking, cancellation, deposits, refunds and general terms for Iron & Oak Barbershop."
      : "How Iron & Oak Barbershop collects, uses and protects your personal information under POPIA.",
    canonical: `https://iron-oak.example/${kind}`,
  });

  return (
    <section className="section-y">
      <div className="container-x max-w-prose">
        <Reveal><span className="eyebrow">Iron &amp; Oak legal</span></Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-h1">{isTerms ? "Terms & Conditions" : "Privacy Policy"}</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-body-sm text-slate-400">Last updated: 25 September 2026</p>
        </Reveal>

        <Reveal delay={0.14}>
          <nav aria-label="On this page" className="mt-8 border-l border-white/10 pl-4 text-body-sm">
            <p className="text-micro uppercase tracking-eyebrow text-brass">On this page</p>
            <ul className="mt-2 space-y-1">
              {sections.map(([title]) => (
                <li key={title}>
                  <a href={`#${slug(title)}`} className="link-quiet">{title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <div className="mt-10 space-y-8 text-body text-slate-300">
          {sections.map(([title, body], i) => (
            <Reveal key={title} delay={0.05 + Math.min(i, 6) * 0.03}>
              <section id={slug(title)} className="scroll-mt-28">
                <h2 className="text-h4 text-cream">{title}</h2>
                <p className="mt-2">{body}</p>
              </section>
            </Reveal>
          ))}

          <p className="border-t border-white/[0.06] pt-6 text-nano text-slate-500">
            This document is provided for transparency and does not constitute legal advice.
          </p>
        </div>
      </div>
    </section>
  );
}