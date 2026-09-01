"use client";

import { useEffect } from "react";
import type { ProjectItem } from "@/app/lib/projects";
import ProjectDetailView from "./ProjectDetailView";
import ProjectDetailHeader from "./ProjectDetailHeader";

interface ProjectDetailOverlayProps {
  project: ProjectItem;
  onClose: () => void;
}

export default function ProjectDetailOverlay({
  project,
  onClose,
}: ProjectDetailOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Lock background page scroll while overlay is open
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] overflow-y-auto overscroll-contain bg-black text-white">
      {/* =========================================================
          TOP STICKY BAR (BRIGHTENED BORDERS & BACK/CLOSE BUTTONS)
      ========================================================= */}
      <ProjectDetailHeader onClose={onClose} />

      {/* =========================================================
          CENTERED ARTICLE CONTENT
      ========================================================= */}
      <main className="flex w-full justify-center">
        <ProjectDetailView
          project={project}
          onBackClick={onClose}
          isOverlay={true}
        />
      </main>
    </div>
  );
}