"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Canvas/Editor boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-bg-surface/60 border border-state-error/20 rounded-2xl max-w-md mx-auto space-y-4 shadow-lg backdrop-blur-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-state-error/10 text-state-error shadow-md border border-state-error/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Canvas Connection Failed</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            There was a problem connecting to the collaborative session. This is usually due to authentication/permission issues or sudden connection drops.
          </p>
          <Button
            size="sm"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="h-8 text-xs font-semibold cursor-pointer"
          >
            Retry Connection
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
