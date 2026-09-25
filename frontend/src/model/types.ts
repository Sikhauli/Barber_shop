export type ServiceCategory = "Haircuts" | "Fades" | "Beard" | "Packages" | "Kids";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  duration: number;
  price: number;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  specialties: string[];
}

export interface BookingCustomer {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface Booking {
  reference: string;
  service: Service;
  barber: Barber | null;
  date: string;
  start: string;
  end: string;
  customer: BookingCustomer;
}