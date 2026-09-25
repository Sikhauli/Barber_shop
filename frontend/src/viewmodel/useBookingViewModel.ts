import { useEffect, useMemo, useState } from "react";
import { barbers, services } from "../model/data";
import type { Barber, Booking, BookingCustomer, Service } from "../model/types";
import { addMinutes } from "../lib/ics";

const STORAGE_KEY = "iron-oak.booking.draft.v1";

type Draft = {
  serviceId: string;
  barberId: string | null;
  date: string;
  time: string;
};

function loadDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed.serviceId || !parsed.date || !parsed.time) return null;
    return parsed;
  } catch {
    return null;
  }
}

export type Step = "service" | "barber" | "date" | "time" | "details" | "confirmed";

export function useBookingViewModel() {
  const draft = useMemo(loadDraft, []);
  const [service, setService] = useState<Service>(
    () => services.find((s) => s.id === draft?.serviceId) ?? services[0]
  );
  const [barber, setBarber] = useState<Barber | null>(
    () => barbers.find((b) => b.id === draft?.barberId) ?? null
  );
  const [date, setDate] = useState<string>(draft?.date ?? "");
  const [time, setTime] = useState<string>(draft?.time ?? "");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (booking) return;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        serviceId: service.id,
        barberId: barber?.id ?? null,
        date,
        time,
      } satisfies Draft)
    );
  }, [service, barber, date, time, booking]);

  const step: Step = booking
    ? "confirmed"
    : !date
    ? "date"
    : !time
    ? "time"
    : "details";

  const dates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 28 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    }).filter((d) => d.getDay() !== 0 && d.getTime() > Date.now() - 86400000);
  }, []);

  const times = useMemo(() => {
    const base: string[] = [];
    for (let h = 9; h <= 17; h++) {
      base.push(`${String(h).padStart(2, "0")}:00`);
      base.push(`${String(h).padStart(2, "0")}:30`);
    }
    return base.filter((t) => {
      const [hh, mm] = t.split(":").map(Number);
      const endMinutes = hh * 60 + mm + service.duration;
      return endMinutes <= 18 * 60;
    });
  }, [service.duration]);

  function reset() {
    setBarber(null);
    setDate("");
    setTime("");
    setBooking(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  function confirm(customer: BookingCustomer) {
    setSubmitting(true);
    try {
      const reference = `IO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      const next: Booking = {
        reference,
        service,
        barber,
        date,
        start: time,
        end: addMinutes(time, service.duration),
        customer,
      };
      setBooking(next);
      sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      setSubmitting(false);
    }
  }

  function confirmWithServer(
    customer: BookingCustomer,
    server: { reference: string; start: string; end: string }
  ) {
    setSubmitting(false);
    const next: Booking = {
      reference: server.reference,
      service,
      barber,
      date,
      start: server.start,
      end: server.end,
      customer,
    };
    setBooking(next);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return {
    services,
    barbers,
    dates,
    times,
    service,
    barber,
    date,
    time,
    booking,
    submitting,
    step,
    setService,
    setBarber,
    setDate,
    setTime,
    confirm,
    confirmWithServer,
    reset,
  };
}