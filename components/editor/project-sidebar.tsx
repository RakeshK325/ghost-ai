"use client";

import * as React from "react";
import { X, Plus, FolderKanban, Users, FolderClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed top-18 bottom-4 w-80 z-40 flex flex-col border border-border-default bg-bg-surface/95 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out select-none",
        isOpen 
          ? "left-4 opacity-100 translate-x-0" 
          : "-left-80 opacity-0 -translate-x-[calc(100%+2rem)]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-default/40">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4.5 w-4.5 text-brand" />
          <h2 className="text-sm font-semibold tracking-wide text-text-primary">
            Projects
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-lg text-text-muted hover:bg-bg-subtle hover:text-text-primary transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs & Content */}
      <Tabs defaultValue="my-projects" className="flex-1 flex flex-col p-4 overflow-hidden">
        <TabsList className="grid grid-cols-2 w-full mb-4 bg-bg-base/60 border border-border-default/50 p-1">
          <TabsTrigger value="my-projects" className="text-xs font-semibold py-1.5">
            My Projects
          </TabsTrigger>
          <TabsTrigger value="shared" className="text-xs font-semibold py-1.5">
            Shared
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 -mx-2 px-2">
          {/* My Projects Tab */}
          <TabsContent value="my-projects" className="mt-0 h-full flex flex-col justify-center py-8">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border-default bg-bg-elevated/40 text-text-muted/70 shadow-inner group">
                <div className="absolute inset-0 rounded-2xl bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <FolderClosed className="h-7 w-7 text-text-muted group-hover:text-brand transition-colors duration-300" />
              </div>
              <h3 className="text-xs font-bold tracking-wide text-text-secondary uppercase mb-1">
                No Projects Yet
              </h3>
              <p className="text-[11px] leading-relaxed text-text-faint max-w-[180px]">
                Create your first collaborative canvas to map out your system architecture.
              </p>
            </div>
          </TabsContent>

          {/* Shared Tab */}
          <TabsContent value="shared" className="mt-0 h-full flex flex-col justify-center py-8">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border-default bg-bg-elevated/40 text-text-muted/70 shadow-inner group">
                <div className="absolute inset-0 rounded-2xl bg-accent-ai/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <Users className="h-7 w-7 text-text-muted group-hover:text-accent-ai-text transition-colors duration-300" />
              </div>
              <h3 className="text-xs font-bold tracking-wide text-text-secondary uppercase mb-1">
                No Shared Projects
              </h3>
              <p className="text-[11px] leading-relaxed text-text-faint max-w-[180px]">
                System designs shared with you by other workspace collaborators will appear here.
              </p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Footer Button */}
      <div className="p-4 border-t border-border-default/40 bg-bg-surface/50 backdrop-blur-sm">
        <Button className="w-full font-semibold gap-2 shadow-[0_0_16px_rgba(0,200,212,0.2)] hover:shadow-[0_0_20px_rgba(0,200,212,0.35)] transition-all duration-300">
          <Plus className="h-4.5 w-4.5" />
          <span>New Project</span>
        </Button>
      </div>
    </aside>
  );
}
