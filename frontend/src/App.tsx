import { Suspense, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SiteLayout } from "./view/layout/SiteLayout";
import { RouteFallback } from "./view/components/RouteFallback";
import { ErrorBoundary } from "./view/components/ErrorBoundary";
import {
  HomePage, ServicesPage, AboutPage, BookingPage,
  ContactPage, LegalPage, NotFoundPage,
} from "./view/pages/lazy";

function PageFade({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function RoutesWithTransitions() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);

  // Focus management on route change (a11y)
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: false });
    // Announce route change for screen readers
    const title = document.title;
    const live = document.getElementById("route-announcer");
    if (live) live.textContent = `Navigated to ${title}`;
  }, [location.pathname]);

  return (
    <>
      {/* SR-only live region for route announcements */}
      <div id="route-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route element={<SiteLayout />}>
            <Route index element={<PageFade><HomePage /></PageFade>} />
            <Route path="services" element={<PageFade><ServicesPage /></PageFade>} />
            <Route path="about"    element={<PageFade><AboutPage /></PageFade>} />
            <Route path="booking"  element={<PageFade><BookingPage /></PageFade>} />
            <Route path="contact"  element={<PageFade><ContactPage /></PageFade>} />
            <Route path="terms"    element={<PageFade><LegalPage kind="terms" /></PageFade>} />
            <Route path="privacy"  element={<PageFade><LegalPage kind="privacy" /></PageFade>} />
            <Route path="*"        element={<PageFade><NotFoundPage /></PageFade>} />
          </Route>
        </Routes>
      </AnimatePresence>
      {/* Unused ref keeps TS happy if you later want to focus main programmatically */}
      <span ref={mainRef as any} hidden />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <RoutesWithTransitions />
      </Suspense>
    </ErrorBoundary>
  );
}