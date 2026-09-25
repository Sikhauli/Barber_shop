export function RouteFallback() {
    return (
      <div className="container-x flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-brass border-r-transparent" aria-hidden />
          <span className="text-caption text-slate-400">Loading…</span>
        </div>
      </div>
    );
  }