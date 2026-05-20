"use client";

import React, { useState } from "react";
import { Eye, Workflow, GitBranch, Play, Settings } from "lucide-react";
import { EditorLayout } from "@/components/editor/editor-layout";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";

export default function EditorPage() {
  return (
    <EditorLayout>
      {/* Centered Canvas Coming Soon Placeholder with gorgeous premium styling */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none z-10 pointer-events-none">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-border-default/80 bg-bg-surface/50 text-text-muted/65 shadow-2xl backdrop-blur-sm animate-pulse duration-4000">
          <Workflow className="h-9 w-9 text-brand drop-shadow-[0_0_8px_rgba(0,200,212,0.4)]" />
        </div>
        
        <h1 className="text-xl font-bold tracking-tight text-text-primary mb-2 sm:text-2xl">
          Canvas coming soon.
        </h1>
        
        <p className="text-xs text-text-muted max-w-[280px] sm:max-w-sm leading-relaxed">
          The collaborative real-time system architecture workspace is under development. In the next phase, Liveblocks and React Flow will power this space.
        </p>
      </div>

      {/* Floating Canvas HUD (Bottom-Right Panel) */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 bg-bg-surface/90 backdrop-blur-md border border-border-default rounded-xl p-1.5 shadow-lg pointer-events-auto">
        {/* Dialog Trigger to test dialog styling pattern */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-8 text-xs font-semibold gap-1.5 rounded-lg px-3 cursor-pointer"
            >
              <Workflow className="h-3.5 w-3.5" />
              <span>Verify Specs</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <GitBranch className="h-4.5 w-4.5 text-brand" />
                <span>Compile Architecture Spec</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary leading-relaxed">
                Verify that your active collaborative canvas graph resolves correctly without floating nodes or cyclical routes. This transforms the design into a standardized markdown document.
              </DialogDescription>
            </DialogHeader>
            <div className="my-2 border border-border-default bg-bg-base/80 p-4 rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Total Nodes:</span>
                <span className="font-mono text-brand font-semibold">0 Active</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Direct Connections:</span>
                <span className="font-mono text-accent-ai-text font-semibold">0 Edges</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Graph Integrity:</span>
                <span className="font-mono text-text-secondary font-semibold">Empty Canvas</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" className="h-9 text-xs rounded-xl">
                Cancel
              </Button>
              <Button size="sm" className="h-9 text-xs rounded-xl gap-1 disabled:opacity-50" disabled>
                <Play className="h-3 w-3 fill-current" />
                <span>Run Verification</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="h-5 w-[1px] bg-border-default/60" />

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle cursor-pointer"
          title="Canvas settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Subtle indicator tag */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 border border-border-default bg-bg-surface/60 backdrop-blur-md rounded-full text-[10px] sm:text-xs text-text-muted flex items-center gap-2 shadow-sm pointer-events-none select-none">
        <Eye className="h-3.5 w-3.5 text-brand" />
        <span>Base Editor Layout Shell Framework ready.</span>
      </div>
    </EditorLayout>
  );
}
