"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { slugify } from "@/lib/utils";

export type DialogType = "create" | "rename" | "delete" | null;

interface UseProjectActionsProps {
  activeProjectId?: string | null;
}

export function useProjectActions({ activeProjectId = null }: UseProjectActionsProps = {}) {
  const router = useRouter();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate live slug based on name input
  const slug = useMemo(() => {
    return slugify(name);
  }, [name]);

  // Construct stable room ID preview using slug and suffix
  const roomIdPreview = useMemo(() => {
    if (!slug) return "";
    return suffix ? `${slug}-${suffix}` : slug;
  }, [slug, suffix]);

  const openCreate = () => {
    setSelectedProject(null);
    setName("");
    // Generate 4-character random alphanumeric suffix
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    setSuffix(randomSuffix);
    setActiveDialog("create");
  };

  const openRename = (project: Project) => {
    setSelectedProject(project);
    setName(project.name);
    setSuffix("");
    setActiveDialog("rename");
  };

  const openDelete = (project: Project) => {
    setSelectedProject(project);
    setSuffix("");
    setActiveDialog("delete");
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setSelectedProject(null);
    setName("");
    setSuffix("");
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
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            id: roomIdPreview,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create project");
        }

        const newProject = await response.json();
        closeDialog();
        // Navigate to the new workspace URL
        router.push(`/editor/${newProject.id}`);
      } catch (error) {
        console.error("Failed to create project:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (activeDialog === "rename") {
      if (!selectedProject || !name.trim()) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/projects/${selectedProject.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to rename project");
        }

        closeDialog();
        router.refresh();
      } catch (error) {
        console.error("Failed to rename project:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (activeDialog === "delete") {
      if (!selectedProject) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/projects/${selectedProject.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete project");
        }

        closeDialog();
        // Redirect to /editor if deleting the active workspace
        if (activeProjectId === selectedProject.id) {
          router.push("/editor");
        } else {
          router.refresh();
        }
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
    roomIdPreview,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    handleSubmit,
  };
}
