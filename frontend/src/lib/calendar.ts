import type { Booking } from "../model/types";

const SHOP_LOCATION = "24 Keyes Avenue, Rosebank, Johannesburg, 2196";
const SHOP_TZ = "Africa/Johannesburg";

const pad = (n: number) => String(n).padStart(2, "0");

/** Format a local date + time as a floating ICS/Google basic stamp. */
function basicStamp(dateISO: string, time: string): string {
  const [y, m, d] = dateISO.split("-");
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${hh}${mm}00`;
}

export function googleCalendarUrl(b: Booking): string {
  const start = basicStamp(b.date, b.start);
  const end = basicStamp(b.date, b.end);
  const details = [
    `Booking reference: ${b.reference}`,
    `Service: ${b.service.name} (${b.service.duration} min)`,
    b.barber ? `Barber: ${b.barber.name}` : "Barber: Next available",
    b.customer.notes ? `Notes: ${b.customer.notes}` : "",
    "Please arrive 5 minutes early.",
  ].filter(Boolean).join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${b.service.name}${b.barber ? ` with ${b.barber.name}` : ""} — Iron & Oak`,
    dates: `${start}/${end}`,
    details,
    location: SHOP_LOCATION,
    ctz: SHOP_TZ,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(b: Booking): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: `${b.service.name}${b.barber ? ` with ${b.barber.name}` : ""} — Iron & Oak`,
    startdt: `${b.date}T${b.start}:00+02:00`,
    enddt: `${b.date}T${b.end}:00+02:00`,
    body: `Booking ${b.reference}`,
    location: SHOP_LOCATION,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}