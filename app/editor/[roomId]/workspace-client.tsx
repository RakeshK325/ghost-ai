"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  FolderKanban, 
  Share2,
  Sparkles,
  MessageSquareCode,
  Send,
  Workflow,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Grid3X3,
  Minimize2,
  Maximize2,
  Users,
  PanelRightClose,
  PanelRight,
  X,
  PlusCircle,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { UserButton } from "@clerk/nextjs";
import { useProjectActions } from "@/hooks/use-project-actions";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface WorkspaceClientProps {
  initialProjects: Project[];
  activeProject: {
    id: string;
    name: string;
    ownerId: string;
    collaborators: { id: string; email: string }[];
  };
  currentUserEmail: string | null;
  currentUserId: string;
}

export function WorkspaceClient({ 
  initialProjects, 
  activeProject,
  currentUserEmail,
  currentUserId
}: WorkspaceClientProps) {
  const router = useRouter();
  
  // Sidebar state management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiBarOpen, setAiBarOpen] = useState(true);
  
  // Custom dialog state for sharing
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [localCollaborators, setLocalCollaborators] = useState<any[]>(activeProject.collaborators);
  const [ownerDetails, setOwnerDetails] = useState<any>(null);
  const [isLoadingCollabs, setIsLoadingCollabs] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch collaborators and owner when dialog opens
  React.useEffect(() => {
    if (!shareDialogOpen) return;

    let active = true;
    async function fetchCollabs() {
      setIsLoadingCollabs(true);
      setErrorText("");
      try {
        const res = await fetch(`/api/projects/${activeProject.id}/collaborators`);
        if (!res.ok) {
          let errMsg = "Failed to load collaborators";
          try {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const errData = await res.json();
              errMsg = errData.error || errMsg;
            }
          } catch (_) {}
          throw new Error(errMsg);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received invalid response from server");
        }

        const data = await res.json();
        if (active) {
          setLocalCollaborators(data.collaborators);
          setOwnerDetails(data.owner);
        }
      } catch (err: any) {
        console.error(err);
        if (active) {
          setErrorText(err.message || "An error occurred");
        }
      } finally {
        if (active) {
          setIsLoadingCollabs(false);
        }
      }
    }

    fetchCollabs();

    return () => {
      active = false;
    };
  }, [shareDialogOpen, activeProject.id]);
  
  // Hook for standard project dialogs
  const {
    activeDialog,
    selectedProject,
    name,
    setName,
    roomIdPreview,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    handleSubmit,
  } = useProjectActions({ activeProjectId: activeProject.id });

  // Handle active project selection from the sidebar
  const handleSelectProject = (id: string | null) => {
    if (id) {
      router.push(`/editor/${id}`);
    } else {
      router.push("/editor");
    }
  };

  // Mock workspace AI assistant chat history
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: `Hello! I'm your Ghost AI assistant. I can help you model your system architecture for "${activeProject.name}". Ask me to draft components or write schemas!`
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    // Simulate AI thinking and replying
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `I've received your request: "${userMsg}". Real-time canvas updates and design generation are scheduled for the next phase of implementation. Stay tuned!`
        }
      ]);
    }, 1000);
  };

  // Handle adding collaborators (fully functional linked to backend API)
  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || isInviting) return;

    setIsInviting(true);
    setErrorText("");
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received invalid response from server");
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add collaborator");
      }

      setLocalCollaborators((prev) => [...prev, data]);
      setInviteEmail("");
    } catch (err: any) {
      console.error("Failed to add collaborator:", err);
      setErrorText(err.message || "An error occurred");
    } finally {
      setIsInviting(false);
    }
  };

  // Handle removing a collaborator
  const handleRemoveCollaborator = async (collabId: string) => {
    setErrorText("");
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: collabId }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received invalid response from server");
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to remove collaborator");
      }

      setLocalCollaborators((prev) => prev.filter((c) => c.id !== collabId));
    } catch (err: any) {
      console.error("Failed to remove collaborator:", err);
      setErrorText(err.message || "An error occurred");
    }
  };

  // Is current user the owner?
  const isOwner = activeProject.ownerId === currentUserId;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg-base font-sans antialiased text-text-primary select-none">
      
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 w-full items-center justify-between border-b border-border-default bg-bg-surface/80 px-4 backdrop-blur-md transition-all duration-300">
        
        {/* Left Navbar section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="h-9 w-9 text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors cursor-pointer"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <PanelLeftOpen className="h-5 w-5 transition-transform duration-200" />
            )}
          </Button>
          
          <div className="flex items-center gap-2 select-none border-l border-border-default/50 pl-3">
            <Activity className="h-4.5 w-4.5 text-brand drop-shadow-[0_0_6px_rgba(0,200,212,0.4)] animate-pulse" />
            <span className="font-mono text-sm font-black tracking-widest bg-gradient-to-r from-brand via-accent-ai-text to-brand bg-clip-text text-transparent">
              GHOST
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-bg-elevated border border-border-subtle/50 text-text-secondary">
              AI
            </span>
          </div>
        </div>

        {/* Center Navbar Section - Displays active workspace room metadata */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-medium text-text-muted">Active Canvas:</span>
          <div className="flex items-center gap-2 bg-bg-elevated/60 border border-border-default/50 px-3 py-1 rounded-full shadow-inner">
            <span className="h-1.5 w-1.5 rounded-full bg-state-success animate-ping" />
            <span className="text-xs font-bold text-text-primary">
              {activeProject.name}
            </span>
            <span className="text-[9px] font-mono text-text-faint px-1.5 py-0.25 bg-bg-subtle rounded border border-border-default/30">
              {activeProject.id}
            </span>
          </div>
        </div>

        {/* Right Navbar Section - Action buttons and Clerk User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Share collaboration button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareDialogOpen(true)}
            className="h-8 text-xs font-semibold gap-1.5 rounded-lg border-border-default hover:bg-bg-subtle hover:text-text-primary px-3 cursor-pointer shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          {/* AI Sidebar Toggle */}
          <Button
            variant={aiBarOpen ? "secondary" : "outline"}
            size="sm"
            onClick={() => setAiBarOpen((prev) => !prev)}
            className={cn(
              "h-8 text-xs font-semibold gap-1.5 rounded-lg px-3 cursor-pointer transition-all duration-300 shadow-sm",
              aiBarOpen 
                ? "bg-accent-ai/10 text-accent-ai-text border-accent-ai/30 hover:bg-accent-ai/15" 
                : "border-border-default hover:bg-bg-subtle hover:text-text-primary"
            )}
            title="Toggle AI Copilot"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Copilot</span>
          </Button>

          <div className="h-5 w-[1px] bg-border-default/60" />
          
          <UserButton />
        </div>
      </header>

      {/* Sidebar - Floating left list */}
      <ProjectSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        projects={initialProjects}
        activeProjectId={activeProject.id}
        onSelectProject={handleSelectProject}
        onCreateProjectClick={openCreate}
        onRenameProjectClick={openRename}
        onDeleteProjectClick={openDelete}
      />

      {/* Workspace Area: Main viewport and right floating AI Panel */}
      <main className="absolute inset-0 pt-14 bg-bg-base flex transition-all duration-300">
        
        {/* Canvas Area Container */}
        <div className="flex-1 h-full relative overflow-hidden bg-bg-base bg-[radial-gradient(rgba(42,42,48,0.45)_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-6 text-center select-none z-10 transition-all duration-300">
          
          {/* Decorative glowing center radial layout */}
          <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Canvas empty state wrapper */}
          <div className="relative flex flex-col items-center max-w-lg mx-auto">
            {/* Glowing lock/workflow badge */}
            <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-border-default bg-bg-surface/90 text-brand shadow-[0_8px_32px_rgba(0,0,0,0.5)] drop-shadow-[0_0_15px_rgba(0,200,212,0.12)]">
              <Workflow className="h-8 w-8 text-brand" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-state-success/20 bg-state-success/5 text-[10px] font-bold tracking-wider text-state-success uppercase mb-4 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-state-success animate-ping" />
              <span>Canvas Sync Ready</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary mb-3 bg-gradient-to-b from-text-primary to-text-secondary bg-clip-text">
              {activeProject.name}
            </h1>
            
            <p className="text-xs sm:text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
              Collaborative canvas room initialized for <span className="font-semibold text-brand">Liveblocks</span> room session. Canvas graph node structure will load here.
            </p>

            <div className="p-4 border border-border-default/60 bg-bg-surface/40 backdrop-blur-md rounded-2xl max-w-md w-full text-left space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-brand" />
                <span>Next steps:</span>
              </h4>
              <ul className="text-[11px] text-text-muted space-y-2 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-brand shrink-0">→</span>
                  <span>Open the <strong className="text-text-secondary">AI Copilot</strong> panel on the right.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand shrink-0">→</span>
                  <span>Ask the AI to draft a microservice stack or API gateway.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand shrink-0">→</span>
                  <span>Once nodes are created, compile technical specs automatically.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Floating Canvas HUD (Bottom-Center HUD overlay) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-bg-surface/90 backdrop-blur-md border border-border-default rounded-xl p-1.5 shadow-lg">
            <span className="text-[10px] font-mono text-text-faint px-2">CANVAS HUD MOCK</span>
            <div className="h-4 w-[1px] bg-border-default/60" />
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-text-muted cursor-not-allowed"><Grid3X3 className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-text-muted cursor-not-allowed"><Minimize2 className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-text-muted cursor-not-allowed"><Maximize2 className="h-3.5 w-3.5" /></Button>
          </div>
        </div>

        {/* AI Sidebar Copilot Slideout - Floating right side matching ProjectSidebar layout */}
        <aside
          className={cn(
            "fixed top-18 bottom-4 w-80 sm:w-90 z-40 flex flex-col border border-border-default bg-bg-surface/95 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out select-none",
            aiBarOpen 
              ? "right-4 opacity-100 translate-x-0" 
              : "-right-80 sm:-right-90 opacity-0 translate-x-[calc(100%+2rem)]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-default/40">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-accent-ai-text" />
              <h2 className="text-sm font-semibold tracking-wide text-text-primary">
                Ghost AI Copilot
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAiBarOpen(false)}
              className="h-8 w-8 rounded-lg text-text-muted hover:bg-bg-subtle hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Messages viewport */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-2xl p-3 text-[11px] sm:text-xs leading-relaxed border animate-in fade-in duration-200",
                    msg.sender === "user"
                      ? "ml-auto bg-bg-elevated border-border-default text-text-primary rounded-br-none"
                      : "bg-accent-ai/5 border-accent-ai/15 text-text-secondary rounded-bl-none"
                  )}
                >
                  <span className="font-bold text-[9px] uppercase tracking-wider mb-1 text-text-muted">
                    {msg.sender === "user" ? "You" : "Ghost AI"}
                  </span>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick-Prompt Pills Suggestions */}
          <div className="px-4 py-2 border-t border-border-default/20 bg-bg-surface/50">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-faint block mb-1.5">
              Quick Actions
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setChatInput("Generate microservices node structure")}
                className="text-[10px] text-left text-text-secondary bg-bg-base hover:bg-bg-subtle border border-border-default hover:border-border-subtle rounded-lg px-2 py-1 transition-all duration-200 cursor-pointer"
              >
                + Microservices Template
              </button>
              <button
                onClick={() => setChatInput("Add Redis caching tier to database")}
                className="text-[10px] text-left text-text-secondary bg-bg-base hover:bg-bg-subtle border border-border-default hover:border-border-subtle rounded-lg px-2 py-1 transition-all duration-200 cursor-pointer"
              >
                + Caching Tier
              </button>
            </div>
          </div>

          {/* Chat Form Input */}
          <form onSubmit={handleSendChatMessage} className="p-4 border-t border-border-default/40 bg-bg-surface/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                placeholder="Describe changes or systems..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-bg-base border-border-default hover:border-border-subtle focus-visible:ring-accent-ai text-xs h-9 rounded-xl"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-9 w-9 rounded-xl bg-accent-ai hover:bg-accent-ai/90 border-transparent text-white cursor-pointer shadow-[0_0_16px_rgba(100,87,249,0.2)]"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        </aside>

      </main>

      {/* Share / Invites Collaboration Dialog overlay */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md p-6 gap-0">
          <DialogHeader className="pb-4 border-b border-border-default/20">
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand" />
              <span>Share Workspace</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary mt-1">
              Invite other engineering collaborators to work on the architecture graph in real-time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-4">
            {errorText && (
              <div className="px-3 py-2 bg-state-error/10 border border-state-error/20 rounded-xl text-[11px] text-state-error font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="h-1.5 w-1.5 rounded-full bg-state-error animate-pulse shrink-0" />
                <span className="truncate">{errorText}</span>
              </div>
            )}

            {/* Add collaborator form */}
            {isOwner ? (
              <form onSubmit={handleAddCollaborator} className="space-y-2">
                <label htmlFor="invite-email" className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Add Collaborator by Email
                </label>
                <div className="flex gap-2 w-full min-w-0">
                  <div className="relative flex-1 min-w-0">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="engineer@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      className="pl-10 bg-bg-base border-border-default hover:border-border-subtle focus-visible:ring-brand h-10 text-xs rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!inviteEmail.trim() || isInviting} 
                    className="h-10 text-xs rounded-xl px-4 cursor-pointer gap-1 shrink-0"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>{isInviting ? "Adding..." : "Invite"}</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="px-4 py-3 bg-bg-elevated/40 border border-border-default/50 rounded-xl text-xs text-text-muted flex items-start gap-2">
                <Lock className="h-4 w-4 text-text-faint shrink-0 mt-0.5" />
                <span>Only the project owner can invite or remove collaborators from this workspace.</span>
              </div>
            )}

            {/* Collaborator List */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Current Collaborators
              </h4>
              <div className="border border-border-default rounded-xl bg-bg-base/60 divide-y divide-border-default/30 max-h-36 overflow-y-auto shadow-inner">
                
                {/* Project Owner */}
                <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {ownerDetails?.imageUrl ? (
                      <img
                        src={ownerDetails.imageUrl}
                        alt={ownerDetails.name}
                        className="h-7 w-7 rounded-full object-cover border border-border-default"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-brand/10 flex items-center justify-center text-[10px] font-bold text-brand border border-brand/20">
                        {ownerDetails?.name?.charAt(0) || "O"}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-text-primary truncate">
                        {ownerDetails?.name || "Owner"}
                      </span>
                      <span className="text-[10px] text-text-faint font-mono truncate">
                        {ownerDetails?.email || "owner@company.com"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-brand select-none">
                    Owner
                  </span>
                </div>

                {/* Invited Collaborators */}
                {isLoadingCollabs ? (
                  <div className="p-4 text-center text-[10px] text-text-muted animate-pulse">
                    Loading collaborators...
                  </div>
                ) : localCollaborators.length === 0 ? (
                  <div className="p-4 text-left text-[10px] text-text-faint pl-4">
                    No other collaborators have been invited yet.
                  </div>
                ) : (
                  localCollaborators.map((collab) => (
                    <div key={collab.id} className="flex items-center justify-between px-4 py-2.5 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {collab.imageUrl ? (
                          <img
                            src={collab.imageUrl}
                            alt={collab.name || collab.email}
                            className="h-7 w-7 rounded-full object-cover border border-border-default"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-bg-elevated flex items-center justify-center border border-border-default text-text-muted">
                            <Mail className="h-3.5 w-3.5 text-text-faint shrink-0" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          {collab.name && (
                            <span className="font-semibold text-text-primary truncate">
                              {collab.name}
                            </span>
                          )}
                          <span className={cn(
                            "truncate font-mono",
                            collab.name ? "text-[10px] text-text-faint" : "text-text-secondary font-medium"
                          )}>
                            {collab.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-bg-elevated border border-border-subtle/50 text-text-muted select-none">
                          Collaborator
                        </span>
                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCollaborator(collab.id)}
                            className="h-6 w-6 rounded-md text-text-muted hover:text-state-error hover:bg-state-error/10 transition-colors cursor-pointer"
                            title="Revoke access"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Copy Project Link */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                Workspace Link
              </span>
              <div className="flex gap-2 w-full min-w-0">
                <Input
                  readOnly
                  value={typeof window !== "undefined" ? `${window.location.origin}/editor/${activeProject.id}` : `/editor/${activeProject.id}`}
                  className="flex-1 bg-bg-base border border-border-default text-text-secondary select-all font-mono text-xs h-10 rounded-xl px-3"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator.clipboard.writeText(`${window.location.origin}/editor/${activeProject.id}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                      setShareDialogOpen(false);
                    }
                  }}
                  className="h-10 text-xs rounded-xl px-4 border-border-default hover:bg-bg-subtle shrink-0 cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>

            {/* Footer with a unified button */}
            <div className="pt-4 border-t border-border-default/20">
              <Button 
                onClick={() => setShareDialogOpen(false)} 
                className="h-10 text-xs font-semibold rounded-xl w-full cursor-pointer bg-brand hover:opacity-90 text-bg-base shadow-sm transition-all"
              >
                Close Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Control dialogs managed by useProjectActions hooks */}
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
              <label htmlFor="project-name-ws" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Project Name
              </label>
              <Input
                id="project-name-ws"
                placeholder="e.g. Payments Microservice"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
                className="bg-bg-base border-border-default hover:border-border-subtle focus-visible:ring-brand text-xs h-10 rounded-xl"
              />
            </div>

            {name.trim() && (
              <div className="space-y-1.5 my-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Liveblocks Room ID (Alignment ID)
                </span>
                <div className="px-3 py-2 bg-bg-elevated border border-border-default rounded-xl font-mono text-[11px] text-brand select-all break-all">
                  {roomIdPreview}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} className="h-9 text-xs rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim() || isLoading} className="h-9 text-xs rounded-xl cursor-pointer">
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
              <label htmlFor="rename-name-ws" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                New Project Name
              </label>
              <Input
                id="rename-name-ws"
                placeholder="Enter new name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
                className="bg-bg-base border-border-default hover:border-border-subtle focus-visible:ring-brand text-xs h-10 rounded-xl"
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
                className="h-9 text-xs rounded-xl bg-state-error text-white hover:bg-state-error/90 border-transparent cursor-pointer font-semibold shadow-[0_0_16px_rgba(255,77,79,0.2)]"
              >
                {isLoading ? "Deleting..." : "Delete Permanently"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
