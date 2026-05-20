"use client";

import React, { useState } from "react";
import { 
  Server, 
  Database, 
  Cpu, 
  Layers, 
  Settings, 
  Workflow, 
  Eye,
  GitBranch,
  Play,
  Plus,
  FolderKanban,
  Trash2,
  Activity
} from "lucide-react";
import { EditorLayout } from "@/components/editor/editor-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Project } from "@/types/project";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

export default function EditorPage() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Dynamic projects list (mock database)
  const [projects, setProjects] = useState<Project[]>([]);

  // Dedicated project dialogs management hook
  const {
    activeDialog,
    selectedProject,
    name,
    setName,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    handleSubmit,
  } = useProjectDialogs({
    onCreateProject: (name, slug) => {
      const newProj: Project = {
        id: `project-${Date.now()}`,
        name,
        slug,
        role: "owner",
      };
      setProjects((prev) => [...prev, newProj]);
      setActiveProjectId(newProj.id);
    },
    onRenameProject: (id, newName, newSlug) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: newName, slug: newSlug } : p))
      );
    },
    onDeleteProject: (id) => {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (activeProjectId === id) {
        setActiveProjectId(null);
      }
    },
  });

  const activeProject = projects.find((p) => p.id === activeProjectId);

  // Architecture Nodes for the simulated Canvas
  const nodes = [
    {
      id: "client",
      title: "Client Application",
      type: "Next.js App",
      icon: Cpu,
      color: "border-border-default bg-bg-surface",
      accent: "text-text-secondary",
      x: "left-[12%] sm:left-[16%]",
      y: "top-[20%]",
      details: "Edge-rendered web app with server component routing."
    },
    {
      id: "gateway",
      title: "API Gateway",
      type: "AI Routing Layer",
      icon: Layers,
      color: "border-brand bg-brand/5 shadow-[0_0_15px_rgba(0,200,212,0.08)]",
      accent: "text-brand",
      x: "left-[45%]",
      y: "top-[35%]",
      details: "Trigger.dev background work pipeline coordinator."
    },
    {
      id: "database",
      title: "User Registry",
      type: "PostgreSQL DB",
      icon: Database,
      color: "border-accent-ai bg-accent-ai/5 shadow-[0_0_15px_rgba(100,87,249,0.08)]",
      accent: "text-accent-ai-text",
      x: "left-[72%]",
      y: "top-[48%]",
      details: "Prisma client interface for structured schemas."
    }
  ];

  return (
    <EditorLayout
      projects={projects}
      activeProjectId={activeProjectId}
      onSelectProject={(id) => {
        setActiveProjectId(id);
        setActiveNode(null);
      }}
      onCreateProjectClick={openCreate}
      onRenameProjectClick={openRename}
      onDeleteProjectClick={openDelete}
      activeProjectName={activeProject?.name}
    >
      {activeProject ? (
        <>
          {/* Connection SVG Lines */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full">
            <defs>
              <linearGradient id="grad-brand" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-ai" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-ai)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--accent-ai)" stopOpacity="0.8" />
              </linearGradient>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 10 5 L 0 8 z" fill="rgba(240, 240, 244, 0.45)" />
              </marker>
            </defs>

            {/* Client to Gateway */}
            <path
              d="M 280 174 C 370 174, 370 284, 480 284"
              fill="none"
              stroke="url(#grad-brand)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-[dash_20s_linear_infinite]"
              markerEnd="url(#arrow)"
            />

            {/* Gateway to Database */}
            <path
              d="M 640 319 C 690 319, 690 414, 770 414"
              fill="none"
              stroke="url(#grad-ai)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-[dash_20s_linear_infinite]"
              markerEnd="url(#arrow)"
            />
          </svg>

          {/* Floating Canvas HUD (Bottom-Right Panel) */}
          <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-3">
            {/* Node detail Card on selection */}
            {activeNode && (
              <Card className="w-72 bg-bg-surface/90 backdrop-blur-md border-border-default rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-250">
                <CardHeader className="p-4 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Node Properties
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {React.createElement(nodes.find(n => n.id === activeNode)?.icon || Server, {
                      className: `h-4 w-4 ${nodes.find(n => n.id === activeNode)?.accent}`
                    })}
                    <span className="text-sm font-semibold text-text-primary">
                      {nodes.find(n => n.id === activeNode)?.title}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-[11px] text-text-secondary leading-relaxed">
                  {nodes.find(n => n.id === activeNode)?.details}
                </CardContent>
                <CardFooter className="p-3 border-t border-border-default/30 flex justify-between bg-bg-elevated/20">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveNode(null)}
                    className="h-7 text-[10px] text-text-muted hover:text-text-primary px-2 cursor-pointer"
                  >
                    Deselect
                  </Button>
                  <span className="text-[10px] font-mono text-text-faint bg-bg-elevated px-2 py-0.5 rounded border border-border-default/40">
                    {nodes.find(n => n.id === activeNode)?.type}
                  </span>
                </CardFooter>
              </Card>
            )}

            {/* Interactive Controls Card */}
            <div className="flex items-center gap-2 bg-bg-surface/90 backdrop-blur-md border border-border-default rounded-xl p-1.5 shadow-lg">
              {/* Dialog Trigger */}
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
                      <span className="font-mono text-brand font-semibold">3 Active</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">Direct Connections:</span>
                      <span className="font-mono text-accent-ai-text font-semibold">2 Edges</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">Graph Integrity:</span>
                      <span className="font-mono text-state-success font-semibold">100% OK</span>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" size="sm" className="h-9 text-xs rounded-xl cursor-pointer">
                      Cancel
                    </Button>
                    <Button size="sm" className="h-9 text-xs rounded-xl gap-1 cursor-pointer">
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
          </div>

          {/* Dynamic Nodes Wrapper */}
          <div className="absolute inset-0 pointer-events-none">
            {nodes.map((node) => {
              const Icon = node.icon;
              const isSelected = activeNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`absolute ${node.x} ${node.y} pointer-events-auto flex flex-col w-56 p-4 rounded-2xl border bg-bg-surface/90 text-text-primary shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${node.color} ${
                    isSelected ? "scale-103 ring-1 ring-brand/60" : "hover:scale-101 hover:border-border-subtle"
                  }`}
                >
                  {/* Node Handles (Visual Indicators) */}
                  <div className="absolute top-1/2 -left-1.5 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-border-default bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:scale-110" />
                  <div className="absolute top-1/2 -right-1.5 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-border-default bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:scale-110" />
                  
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-bg-base/80 border border-border-default/50`}>
                      <Icon className={`h-5 w-5 ${node.accent}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-text-primary leading-tight">
                        {node.title}
                      </h4>
                      <span className="text-[10px] font-mono text-text-faint">
                        {node.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canvas Guide instructions */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 border border-border-default bg-bg-surface/60 backdrop-blur-md rounded-full text-[10px] sm:text-xs text-text-muted flex items-center gap-2 shadow-sm pointer-events-none select-none">
            <Eye className="h-3.5 w-3.5 text-brand" />
            <span>Active Room: {activeProject.name}. Click nodes to view properties.</span>
          </div>
        </>
      ) : (
        /* Home screen shown when no project is active */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none z-10">
          {/* Subtle tech background radial grid and premium blur glow */}
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
          
          <div className="relative flex flex-col items-center max-w-lg mx-auto">
            {/* Premium action icon container */}
            <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-border-default bg-bg-surface/90 text-brand shadow-[0_8px_32px_rgba(0,0,0,0.5)] drop-shadow-[0_0_15px_rgba(0,200,212,0.12)]">
              <Activity className="h-8 w-8 text-brand" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary mb-3 bg-gradient-to-b from-text-primary to-text-secondary bg-clip-text">
              Create a project or open an existing one
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md mb-8 leading-relaxed">
              Start a new architecture workspace, or choose a project from the sidebar.
            </p>

            <Button
              onClick={openCreate}
              className="h-11 px-6 font-semibold gap-2 rounded-xl text-sm shadow-[0_0_24px_rgba(0,200,212,0.2)] hover:shadow-[0_0_32px_rgba(0,200,212,0.38)] hover:scale-102 transition-all duration-300 cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>New Project</span>
            </Button>
          </div>
        </div>
      )}

      {/* Controlled Dialog overlays */}
      <Dialog open={activeDialog === "create"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-brand" />
                <span>Create Project</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary">
                Start a new collaborative workspace. Name your project to get started.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 my-2">
              <label htmlFor="project-name" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="e.g. Payments Microservice"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
                className="bg-bg-base border-border-default hover:border-border-subtle focus-visible:ring-brand"
              />

            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} className="h-9 text-xs rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim() || isLoading} className="h-9 text-xs rounded-xl gap-1 cursor-pointer">
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "rename"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-brand" />
                <span>Rename Project</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary leading-relaxed">
                Currently named: <span className="font-semibold text-text-primary">{selectedProject?.name}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 my-2">
              <label htmlFor="rename-name" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                New Project Name
              </label>
              <Input
                id="rename-name"
                placeholder="Enter new name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
                className="bg-bg-base border-border-default hover:border-border-subtle focus-visible:ring-brand"
              />

            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} className="h-9 text-xs rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim() || isLoading} className="h-9 text-xs rounded-xl cursor-pointer">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "delete"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-state-error">
                <Trash2 className="h-5 w-5" />
                <span>Delete Project</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-text-primary">{selectedProject?.name}</span>? This action cannot be undone, and all collaborative nodes and technical specs will be lost.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} className="h-9 text-xs rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-9 text-xs rounded-xl bg-state-error text-white hover:bg-state-error/90 border-transparent cursor-pointer shadow-[0_0_16px_rgba(255,77,79,0.2)] hover:shadow-[0_0_20px_rgba(255,77,79,0.35)] transition-all duration-300 font-semibold"
              >
                {isLoading ? "Deleting..." : "Delete Permanently"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Connection Animation Styles */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </EditorLayout>
  );
}
