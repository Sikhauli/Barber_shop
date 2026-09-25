import { lazy } from "react";

export const HomePage     = lazy(() => import("./HomePage").then((m) => ({ default: m.HomePage })));
export const ServicesPage = lazy(() => import("./ServicesPage").then((m) => ({ default: m.ServicesPage })));
export const AboutPage    = lazy(() => import("./AboutPage").then((m) => ({ default: m.AboutPage })));
export const BookingPage  = lazy(() => import("./BookingPage").then((m) => ({ default: m.BookingPage })));
export const ContactPage  = lazy(() => import("./ContactPage").then((m) => ({ default: m.ContactPage })));
export const LegalPage    = lazy(() => import("./LegalPage").then((m) => ({ default: m.LegalPage })));
export const NotFoundPage = lazy(() => import("./NotFoundPage").then((m) => ({ default: m.NotFoundPage })));