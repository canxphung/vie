/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** Catches render-time crashes so a bug shows a readable message instead of a blank screen. */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface the full error in the console for debugging.
    console.error('UI crash captured by ErrorBoundary:', error, info);
  }

  handleReset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="mx-auto my-16 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h2 className="text-lg font-bold">Đã xảy ra lỗi giao diện</h2>
        <p className="mt-1 text-sm text-red-700">{error.message}</p>
        {error.stack && (
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-white/70 p-3 text-[11px] leading-relaxed text-red-900">
            {error.stack}
          </pre>
        )}
        <button
          type="button"
          onClick={this.handleReset}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }
}
