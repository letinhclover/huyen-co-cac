// ============================================================
// ErrorBoundary.tsx — Catch component crashes gracefully
// ============================================================

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}
interface State { hasError: boolean; message: string; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message ?? "Lỗi không xác định" };
  }

  componentDidCatch(error: Error) {
    console.error(`[ErrorBoundary:${this.props.name ?? "?"}]`, error);
  }

  handleRetry = () => this.setState({ hasError: false, message: "" });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="mx-4 my-3 rounded-2xl p-5 text-center"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          <p className="text-2xl mb-2">⚠️</p>
          <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
            {this.props.name ?? "Tính năng"} tạm thời gặp lỗi
          </p>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
            {this.state.message.slice(0, 80)}
          </p>
          <button onClick={this.handleRetry}
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)", color: "var(--gold)" }}>
            🔄 Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
