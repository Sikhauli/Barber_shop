import { cn } from "../../../lib/cn";

export function Skeleton({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-xl bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.09)_50%,rgba(255,255,255,0.04)_100%)] bg-[length:200%_100%]",
        className
      )}
      {...rest}
    />
  );
}