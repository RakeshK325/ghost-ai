"use client";

import * as React from "react";
import { 
  X, 
  Plus, 
  FolderKanban, 
  Users, 
  FolderClosed,
  Folder,
  FolderOpen,
  Edit2,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onCreateProjectClick: () => void;
  onRenameProjectClick: (project: Project) => void;
  onDeleteProjectClick: (project: Project) => void;
}

export function ProjectSidebar({ 
  isOpen, 
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProjectClick,
  onRenameProjectClick,
  onDeleteProjectClick,
}: ProjectSidebarProps) {
  const ownedProjects = projects.filter((p) => p.role === "owner");
  const sharedProjects = projects.filter((p) => p.role === "collaborator");

  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden cursor-pointer"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-18 bottom-4 w-80 z-45 flex flex-col border border-border-default bg-bg-surface/95 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out select-none",
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
            <TabsTrigger value="my-projects" className="text-xs font-semibold py-1.5 cursor-pointer">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="text-xs font-semibold py-1.5 cursor-pointer">
              Shared
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 -mx-2 px-2">
            {/* My Projects Tab */}
            <TabsContent value="my-projects" className="mt-0 h-full">
              {ownedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-4 py-8 h-full min-h-[220px]">
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
              ) : (
                <div className="flex flex-col gap-1 pr-1">
                  {ownedProjects.map((project) => {
                    const isActive = project.id === activeProjectId;
                    return (
                      <div
                        key={project.id}
                        onClick={() => onSelectProject(project.id)}
                        className={cn(
                          "group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all duration-200 cursor-pointer border",
                          isActive
                            ? "bg-bg-elevated border-brand text-text-primary shadow-[0_0_12px_rgba(0,200,212,0.06)]"
                            : "bg-transparent border-transparent text-text-secondary hover:bg-bg-subtle/50 hover:text-text-primary hover:border-border-default/40"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {isActive ? (
                            <FolderOpen className="h-4 w-4 text-brand shrink-0" />
                          ) : (
                            <Folder className="h-4 w-4 text-text-muted group-hover:text-text-secondary shrink-0" />
                          )}
                          <span className="truncate font-medium">{project.name}</span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 shrink-0 pl-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRenameProjectClick(project);
                            }}
                            className="h-6 w-6 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors cursor-pointer"
                            title="Rename project"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProjectClick(project);
                            }}
                            className="h-6 w-6 rounded-md text-text-muted hover:text-state-error hover:bg-state-error/10 transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Shared Tab */}
            <TabsContent value="shared" className="mt-0 h-full">
              {sharedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-4 py-8 h-full min-h-[220px]">
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
              ) : (
                <div className="flex flex-col gap-1 pr-1">
                  {sharedProjects.map((project) => {
                    const isActive = project.id === activeProjectId;
                    return (
                      <div
                        key={project.id}
                        onClick={() => onSelectProject(project.id)}
                        className={cn(
                          "group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all duration-200 cursor-pointer border",
                          isActive
                            ? "bg-bg-elevated border-accent-ai/50 text-text-primary shadow-[0_0_12px_rgba(100,87,249,0.06)]"
                            : "bg-transparent border-transparent text-text-secondary hover:bg-bg-subtle/50 hover:text-text-primary hover:border-border-default/40"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {isActive ? (
                            <FolderOpen className="h-4 w-4 text-accent-ai-text shrink-0" />
                          ) : (
                            <Folder className="h-4 w-4 text-text-muted group-hover:text-text-secondary shrink-0" />
                          )}
                          <span className="truncate font-medium">{project.name}</span>
                        </div>
                        {/* Hide actions for shared/collaborator projects */}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer Button */}
        <div className="p-4 border-t border-border-default/40 bg-bg-surface/50 backdrop-blur-sm">
          <Button 
            onClick={onCreateProjectClick}
            className="w-full font-semibold gap-2 shadow-[0_0_16px_rgba(0,200,212,0.2)] hover:shadow-[0_0_20px_rgba(0,200,212,0.35)] transition-all duration-300 cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>New Project</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
