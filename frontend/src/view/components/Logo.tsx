import { Link } from "react-router-dom";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="Iron & Oak — home">
      <svg
        viewBox="0 0 40 40"
        width="34"
        height="34"
        role="img"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300 ease-out-expo group-hover:rotate-[-4deg]"
      >
        <rect width="40" height="40" rx="10" fill="#C9A227" />
        <path d="M11 30V10h3.2v20H11Z" fill="#0E0E10" />
        <path d="M18.4 10h3.2v7.4c0 1.9 1.1 3 2.9 3 1.9 0 3-1.1 3-3V10h3.2v7.8c0 3.6-2.4 5.8-6.2 5.8s-6.1-2.2-6.1-5.8V10Z" fill="#0E0E10" />
      </svg>
      {!compact && (
        <span className="font-display text-[22px] font-semibold leading-none tracking-tight text-cream">
          IRON <span className="text-brass">&amp;</span> OAK
        </span>
      )}
    </Link>
  );
}