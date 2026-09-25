import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "../../../lib/cn";

export type ToastVariant = "success" | "error" | "warning" | "info";
export type Toast = {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number; // ms, 0 = sticky
};

type State = { items: Toast[] };
type Action =
  | { type: "add"; toast: Toast }
  | { type: "remove"; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add":    return { items: [...state.items, action.toast] };
    case "remove": return { items: state.items.filter((t) => t.id !== action.id) };
    default:       return state;
  }
}

type Ctx = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 size={18} className="text-success" />,
  error:   <XCircle size={18} className="text-danger" />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  info:    <Info size={18} className="text-brass" />,
};

const BORDERS: Record<ToastVariant, string> = {
  success: "border-success/40",
  error:   "border-danger/40",
  warning: "border-warning/40",
  info:    "border-brass/40",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    if (!toast.duration) return;
    const t = window.setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => window.clearTimeout(t);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role={toast.variant === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-2xl border bg-charcoal/95 p-4 shadow-lift backdrop-blur",
        "animate-fade-up",
        BORDERS[toast.variant]
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{ICONS[toast.variant]}</span>
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-semibold text-cream">{toast.title}</p>
          {toast.description && <p className="mt-1 text-caption text-slate-300">{toast.description}</p>}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="rounded-full p-1 text-slate-400 transition hover:bg-white/5 hover:text-cream"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    dispatch({ type: "add", toast: { ...t, id, duration: t.duration ?? 5000 } });
    return id;
  }, []);

  const dismiss = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => state.items.forEach((t) => dispatch({ type: "remove", id: t.id })), [state.items]);

  const value = useMemo(() => ({ toasts: state.items, push, dismiss, clear }), [state.items, push, dismiss, clear]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="false"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
        >
          {state.items.map((t) => <ToastItem key={t.id} toast={t} onDismiss={dismiss} />)}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}