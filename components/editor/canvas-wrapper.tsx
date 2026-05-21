"use client";

import React from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { Loader2 } from "lucide-react";
import { ReactFlowProvider } from "@xyflow/react";
import { ErrorBoundary } from "./error-boundary";
import { CollaborativeFlow } from "./collaborative-flow";

import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

interface CanvasWrapperProps {
  projectId: string;
}

function CanvasLoader() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-bg-base space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Elegant pulsing logo ring */}
        <div className="absolute h-12 w-12 rounded-full border border-brand/20 bg-brand/5 animate-ping opacity-75" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border-default bg-bg-surface text-brand shadow-lg">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-1">
        <span className="text-xs font-semibold text-text-secondary animate-pulse">Connecting to session...</span>
        <span className="text-[10px] text-text-faint font-mono tracking-wider">GHOST AI CANVAS SYNC</span>
      </div>
    </div>
  );
}

export function CanvasWrapper({ projectId }: CanvasWrapperProps) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-bg-base">
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider 
          id={projectId} 
          initialPresence={{ 
            cursor: null,
            isThinking: false 
          }}
        >
          <ErrorBoundary>
            <ClientSideSuspense fallback={<CanvasLoader />}>
              <ReactFlowProvider>
                <CollaborativeFlow />
              </ReactFlowProvider>
            </ClientSideSuspense>
          </ErrorBoundary>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  );
}
