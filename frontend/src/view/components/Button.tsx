import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-[transform,background-color,color,box-shadow,border-color] duration-200 ease-out-expo " +
  "disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const variants: Record<Variant, string> = {
  primary:   "bg-brass text-ink hover:bg-brass-400 hover:shadow-brass active:scale-[0.98]",
  secondary: "border border-white/15 text-cream bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/25 active:scale-[0.98]",
  ghost:     "text-cream/80 hover:text-cream hover:bg-white/[0.05]",
  danger:    "bg-danger text-cream hover:brightness-110 active:scale-[0.98]",
  link:      "text-brass hover:text-brass-400 underline-offset-4 hover:underline p-0 h-auto min-h-0",
};

const sizes: Record<Size, string> = {
  sm: "h-9  px-4 text-caption",
  md: "h-11 px-5 text-body-sm",
  lg: "h-12 px-6 text-body",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; loading?: boolean; iconLeft?: ReactNode; iconRight?: ReactNode };

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & CommonProps>(
  ({ variant = "primary", size = "md", className, loading, iconLeft, iconRight, children, disabled, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading && (
        <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {!loading && iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  )
);
Button.displayName = "Button";

export function LinkButton({ variant = "primary", size = "md", className, iconLeft, iconRight, children, ...rest }: LinkProps & CommonProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {iconLeft}{children}{iconRight}
    </Link>
  );
}