import type { Booking } from "../model/types";

const SHOP = {
  name: "Iron & Oak Barbershop",
  address: "24 Keyes Avenue, Rosebank, Johannesburg, 2196",
  tz: "Africa/Johannesburg",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Convert a local ZA date + HH:mm into a UTC ICS basic-format string. */
function toIcsUtc(dateISO: string, time: string): string {
  // Interpret as Africa/Johannesburg (UTC+2, no DST).
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh - 2, mm, 0, 0);
  const dt = new Date(utcMs);
  return (
    dt.getUTCFullYear() +
    pad(dt.getUTCMonth() + 1) +
    pad(dt.getUTCDate()) +
    "T" +
    pad(dt.getUTCHours()) +
    pad(dt.getUTCMinutes()) +
    pad(dt.getUTCSeconds()) +
    "Z"
  );
}

/** Add minutes to HH:mm and return HH:mm (handles day rollover via caller). */
export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
}

/** RFC 5545 escaping. */
function esc(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold long lines at 75 octets with CRLF + single space (RFC 5545 §3.1). */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let buf = "";
  let bufBytes = 0;
  for (const ch of line) {
    const chBytes = new TextEncoder().encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines reserve 1 for leading space
    if (bufBytes + chBytes > limit) {
      out.push(buf);
      buf = ch;
      bufBytes = chBytes;
    } else {
      buf += ch;
      bufBytes += chBytes;
    }
  }
  if (buf) out.push(buf);
  return out.join("\r\n ");
}

function line(key: string, value: string): string {
  return fold(`${key}:${value}`);
}

export function buildIcs(b: Booking): string {
  const dtStart = toIcsUtc(b.date, b.start);
  const dtEnd = toIcsUtc(b.date, b.end);
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const summary = `${b.service.name}${b.barber ? ` with ${b.barber.name}` : ""} — Iron & Oak`;
  const description = [
    `Booking reference: ${b.reference}`,
    `Service: ${b.service.name} (${b.service.duration} min)`,
    b.barber ? `Barber: ${b.barber.name}` : "Barber: Next available",
    b.customer.notes ? `Notes: ${b.customer.notes}` : "",
    `Please arrive 5 minutes early. Free cancellation up to 24h before.`,
  ].filter(Boolean).join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Iron & Oak//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    line("UID", `${b.reference}@iron-oak.example`),
    line("DTSTAMP", dtStamp),
    line("DTSTART", dtStart),
    line("DTEND", dtEnd),
    line("SUMMARY", esc(summary)),
    line("DESCRIPTION", esc(description)),
    line("LOCATION", esc(SHOP.address)),
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    line("DESCRIPTION", esc("Iron & Oak appointment in 30 minutes")),
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n") + "\r\n";
}

export function downloadIcs(b: Booking): void {
  const blob = new Blob([buildIcs(b)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `iron-oak-${b.reference}.ics`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}