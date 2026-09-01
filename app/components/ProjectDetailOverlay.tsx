"use client";

import { useEffect } from "react";
import type { ProjectItem } from "@/app/lib/projects";
import ProjectDetailView from "./ProjectDetailView";

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
          TOP STICKY BAR
      ========================================================= */}
      <div className="sticky top-0 z-20 border-b border-white/[0.08] bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <button
            type="button"
            onClick={onClose}
            className="
              flex
              items-center
              gap-2
              font-mono
              text-[10px]
              uppercase
              tracking-[0.16em]
              text-white/40
              transition-colors
              duration-200
              hover:text-white
            "
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Overview
          </button>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.12]
              text-white/40
              transition-colors
              duration-200
              hover:border-white/30
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

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