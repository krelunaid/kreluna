import { Component, type ErrorInfo, type ReactNode } from "react";

export class ErrorBound extends Component<{ children: ReactNode; label?: string }, { err: string | null }> {
  state: { err: string | null } = { err: null };

  static getDerivedStateFromError(error: Error) {
    return { err: error.message || "errore" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[kreluna]", this.props.label ?? "app", error, info.componentStack);
  }

  render() {
    if (this.state.err) {
      return (
        <div className="grid h-full place-items-center p-6 text-center">
          <div>
            <p className="text-sm font-medium">Modulo fermo</p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-mist">
              Questo pezzo si è fermato. Il resto del sistema resta in piedi. Chiudi la finestra e riapri.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
