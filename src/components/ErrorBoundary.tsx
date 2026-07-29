import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full h-full flex items-center justify-center min-h-[500px] p-6 text-white font-mono">
          <div className="glass-panel p-6 rounded-xl border border-rose-500/50 bg-rose-950/20 max-w-2xl w-full">
            <h2 className="text-rose-500 text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Module Crash Detected
            </h2>
            <div className="bg-dark-900/80 p-4 rounded text-xs text-rose-300 font-mono whitespace-pre-wrap border border-rose-900/50 overflow-auto max-h-64 mb-4">
              {this.state.error && this.state.error.toString()}
            </div>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold transition-colors"
            >
              Attempt Recovery
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
