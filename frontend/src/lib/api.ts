const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export type CreateBookingPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  barberId?: string;
  bookingDate: string;
  startTime: string;
  notes?: string;
  consent: true;
};

export type BookingResponse = {
  reference: string;
  serviceId: string;
  barberId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

export const api = {
  bookings: {
    create: (data: CreateBookingPayload) =>
      request<BookingResponse>("/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    findByReference: (ref: string) => request<BookingResponse>(`/bookings/${ref}`),
    mine: () => request<BookingResponse[]>("/bookings/me/all"),
  },
  contact: {
    send: (data: ContactPayload) =>
      request<void>("/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};