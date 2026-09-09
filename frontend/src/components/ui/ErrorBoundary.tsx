/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary catches unhandled React render/lifecycle errors and displays
 * a recovery UI instead of a blank screen. Errors are logged to the console
 * for future integration with a centralised error-reporting service.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log to console now; swap for a real error-reporting SDK (e.g. Sentry)
    // when a backend monitoring service is introduced in a future iteration.
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError || !this.state.error) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback(this.state.error, this.handleReset);
    }

    return (
      <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />
    );
  }
}

// ---------------------------------------------------------------------------
// Default fallback UI
// ---------------------------------------------------------------------------

interface FallbackProps {
  error: Error;
  onReset: () => void;
}

function DefaultErrorFallback({ error, onReset }: FallbackProps): ReactNode {
  return (
    <div
      role="alert"
      className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-6"
    >
      <div className="max-w-lg w-full bg-white rounded-2xl border border-red-100 shadow-lg p-8 space-y-5 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <span
            className="material-symbols-outlined text-[48px] text-red-400"
            aria-hidden="true"
          >
            error
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-xl font-bold text-[#0b1c30]">
          Something went wrong
        </h1>

        {/* Error message */}
        <p className="text-sm text-[#525f75]">
          An unexpected error occurred. You can try recovering below, or reload
          the page if the problem persists.
        </p>

        {/* Collapsed error detail */}
        <details className="text-left bg-[#f8f9ff] rounded-xl border border-[#e5eeff] p-3 text-xs text-[#525f75] cursor-pointer">
          <summary className="font-semibold select-none">Error detail</summary>
          <pre className="mt-2 whitespace-pre-wrap break-words">
            {error.message}
          </pre>
        </details>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onReset}
            className="px-5 py-2 rounded-xl bg-[#006b53] text-white text-sm font-bold hover:bg-[#005541] transition-colors"
          >
            Try to recover
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-xl bg-[#eff4ff] text-[#525f75] text-sm font-bold hover:bg-[#e5eeff] transition-colors"
          >
            Reload page
          </button>
        </div>

        {/* Feedback hint */}
        <p className="text-xs text-[#8a97a8]">
          If this keeps happening, please{' '}
          <a
            href="https://github.com/prerna2434/Prerna-shirsath/issues/new?template=bug-report.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#006b53]"
          >
            file a bug report
          </a>{' '}
          (no personal health information).
        </p>
      </div>
    </div>
  );
}
