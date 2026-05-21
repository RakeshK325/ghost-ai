"use client";

import { useState, useMemo } from "react";
import { Project } from "@/types/project";

export type DialogType = "create" | "rename" | "delete" | null;

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars except -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

interface UseProjectDialogsProps {
  onCreateProject?: (name: string, slug: string) => Promise<void> | void;
  onRenameProject?: (id: string, newName: string, newSlug: string) => Promise<void> | void;
  onDeleteProject?: (id: string) => Promise<void> | void;
}

export function useProjectDialogs({
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: UseProjectDialogsProps = {}) {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate live slug preview
  const slug = useMemo(() => {
    return slugify(name);
  }, [name]);



  const openCreate = () => {
    setSelectedProject(null);
    setName("");
    setActiveDialog("create");
  };

  const openRename = (project: Project) => {
    setSelectedProject(project);
    setName(project.name);
    setActiveDialog("rename");
  };

  const openDelete = (project: Project) => {
    setSelectedProject(project);
    setActiveDialog("delete");
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setSelectedProject(null);
    setName("");
    setIsLoading(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isLoading) return;

    if (activeDialog === "create") {
      if (!name.trim()) return;
      setIsLoading(true);
      try {
        if (onCreateProject) {
          await onCreateProject(name.trim(), slug);
        }
        closeDialog();
      } catch (error) {
        console.error("Failed to create project:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (activeDialog === "rename") {
      if (!selectedProject || !name.trim()) return;
      setIsLoading(true);
      try {
        if (onRenameProject) {
          await onRenameProject(selectedProject.id, name.trim(), slug);
        }
        closeDialog();
      } catch (error) {
        console.error("Failed to rename project:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (activeDialog === "delete") {
      if (!selectedProject) return;
      setIsLoading(true);
      try {
        if (onDeleteProject) {
          await onDeleteProject(selectedProject.id);
        }
        closeDialog();
      } catch (error) {
        console.error("Failed to delete project:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    activeDialog,
    selectedProject,
    name,
    setName,
    slug,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    handleSubmit,
  };
}
