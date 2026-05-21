"use client";

import * as React from "react";
import { PanelLeftOpen, PanelLeftClose, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeProjectName?: string;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  activeProjectName,
}: EditorNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 w-full items-center justify-between border-b border-border-default bg-bg-surface/80 px-4 backdrop-blur-md transition-all duration-300">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-9 w-9 text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors cursor-pointer"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5 transition-transform duration-200" />
          ) : (
            <PanelLeftOpen className="h-5 w-5 transition-transform duration-200" />
          )}
        </Button>
        
        <div className="flex items-center gap-2 select-none border-l border-border-default/50 pl-3">
          <Activity className="h-4.5 w-4.5 text-brand drop-shadow-[0_0_6px_rgba(0,200,212,0.4)]" />
          <span className="font-mono text-sm font-black tracking-widest bg-gradient-to-r from-brand via-accent-ai-text to-brand bg-clip-text text-transparent">
            GHOST
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-bg-elevated border border-border-subtle/50 text-text-secondary">
            AI
          </span>
        </div>
      </div>

      {/* Center Section */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs font-medium text-text-muted">Canvas:</span>
        <span className="text-xs font-semibold text-text-primary bg-bg-elevated/40 border border-border-default/30 px-2.5 py-1 rounded-md">
          {activeProjectName || "System Architecture Design"}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
