"use client";

import React, { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { Project } from "@/types/project";

interface EditorLayoutProps {
  children: React.ReactNode;
  projects?: Project[];
  activeProjectId?: string | null;
  onSelectProject?: (id: string | null) => void;
  onCreateProjectClick?: () => void;
  onRenameProjectClick?: (project: Project) => void;
  onDeleteProjectClick?: (project: Project) => void;
  activeProjectName?: string;
}

export function EditorLayout({ 
  children,
  projects = [],
  activeProjectId = null,
  onSelectProject = () => {},
  onCreateProjectClick = () => {},
  onRenameProjectClick = () => {},
  onDeleteProjectClick = () => {},
  activeProjectName,
}: EditorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg-base font-sans antialiased text-text-primary select-none">
      {/* Editor Top Header Navbar */}
      <EditorNavbar 
        isSidebarOpen={sidebarOpen} 
        onToggleSidebar={() => setSidebarOpen(prev => !prev)} 
        activeProjectName={activeProjectName}
      />

      {/* Floating Project Sidebar */}
      <ProjectSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={onSelectProject}
        onCreateProjectClick={onCreateProjectClick}
        onRenameProjectClick={onRenameProjectClick}
        onDeleteProjectClick={onDeleteProjectClick}
      />

      {/* Main Editor Screen Viewport */}
      <main className="absolute inset-0 pt-14 bg-bg-base bg-[radial-gradient(rgba(42,42,48,0.45)_1px,transparent_1px)] [background-size:24px_24px]">
        {children}
      </main>
    </div>
  );
}
