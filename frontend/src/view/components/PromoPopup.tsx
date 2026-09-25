import { useCallback, useEffect, useState } from "react";
import { LinkButton } from "./Button";
import { Modal } from "./ui/Modal";

const KEY = "iron-oak.promo.seen";

export function PromoPopup() {
  const [open, setOpen] = useState(false);

  // Open the modal after 7s if not already seen this session.
  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 7000);
    return () => window.clearTimeout(timer);
  }, []);

  // Mark as seen only when the user actually closes it.
  const close = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem(KEY, "1");
  }, []);

  return (
    <Modal
      open={open}
      onClose={close}
      title="First visit? Take 10% off."
      description="New guests get 10% off their first cut or package. Use code FIRST10 at booking."
      size="sm"
    >
      <div className="flex flex-wrap gap-3">
        <LinkButton to="/booking?promo=FIRST10" onClick={close}>
          Book with code →
        </LinkButton>
        <button
          type="button"
          onClick={close}
          className="text-body-sm text-slate-300 hover:text-cream transition"
        >
          No thanks
        </button>
      </div>
    </Modal>
  );
}