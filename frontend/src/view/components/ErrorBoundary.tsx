import { Component, type ErrorInfo, type ReactNode } from "react";

type State = { hasError: boolean };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State { return { hasError: true }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="section-y">
          <div className="container-x text-center">
            <span className="eyebrow">Something went wrong</span>
            <h1 className="mt-3">We hit a snag.</h1>
            <p className="mt-3 text-slate-300">Please refresh the page. If it keeps happening, call us on +27 11 555 0148.</p>
            <button className="btn mt-6" onClick={() => location.reload()}>Reload page</button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}