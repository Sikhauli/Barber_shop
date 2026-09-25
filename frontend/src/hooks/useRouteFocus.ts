import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * On every route change:
 *  - Focus the <main> landmark so screen readers and keyboard users start at content.
 *  - Announce the new page title via a polite live region.
 */
export function useRouteFocus(mainId = "main", announcerId = "route-announcer") {
  const { pathname } = useLocation();
  useEffect(() => {
    const main = document.getElementById(mainId);
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: false });
    }
    const live = document.getElementById(announcerId);
    if (live) live.textContent = `Navigated to ${document.title}`;
  }, [pathname, mainId, announcerId]);
}