"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectItem } from "../lib/projects";
import ProjectCard from "./ProjectCard";
import ProjectDetailOverlay from "./ProjectDetailOverlay";

interface ProjectsGridProps {
  projects: ProjectItem[];
  research: ProjectItem[];
  compressed?: boolean;
}

export default function ProjectsGrid({
  projects,
  research,
  compressed = false,
}: ProjectsGridProps) {
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (projects.length === 0 && research.length === 0) return null;

  // 2 rows default: 4 projects (2x2) and 2 research items
  const visibleProjects = projects.slice(0, 4);
  const extraProjects = projects.slice(4);

  const visibleResearch = research.slice(0, 2);
  const extraResearch = research.slice(2);

  const hasExtra = extraProjects.length > 0 || extraResearch.length > 0;

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => {
        window.scrollBy({ top: 320, behavior: "smooth" });
      }, 100);
    } else {
      setIsExpanded(false);
    }
  };

  return (
    <>
      <div
        className="w-full origin-center pr-0 sm:pr-4 md:pr-6 lg:pr-8 xl:pr-12"
        style={{
          transform: compressed ? "scale(0.94)" : "scale(1)",
          transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* =======================================================
            3-PART GRID: Projects (2fr) | Vertical Line | Research (1fr)
            Both columns match card heights exactly.
        ======================================================= */}
        <div className="flex flex-col gap-10 xl:grid xl:grid-cols-[2fr_auto_1fr] xl:items-stretch xl:gap-0">
          {/* ===================================================
              PROJECTS SECTION (Left 2fr)
          =================================================== */}
          <section className="flex flex-col xl:pr-6">
            <div className="mb-4 flex min-h-8 items-center gap-4">
              <h2 className="whitespace-nowrap font-serif text-xl font-normal tracking-tight text-white/95 sm:text-2xl">
                Projects
              </h2>
              <div className="h-px flex-1 bg-white/15" aria-hidden="true" />
            </div>

            {/* Default 2 Rows (up to 4 cards) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onOpen={setSelected}
                />
              ))}
            </div>

            {/* Extra Projects Animated Drawer */}
            <AnimatePresence>
              {isExpanded && extraProjects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3 pt-3 sm:gap-4 sm:pt-4">
                    {extraProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={visibleProjects.length + index}
                        onOpen={setSelected}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ===================================================
              DYNAMIC VERTICAL DIVIDER LINE
              Stops exactly at the 2nd row in closed state,
              and extends downward only when expanded!
          =================================================== */}
          <div
            className="hidden xl:block w-px bg-white/15 self-stretch transition-all duration-300"
            aria-hidden="true"
          />

          {/* ===================================================
              RESEARCH SECTION (Right 1fr)
          =================================================== */}
          <section className="flex flex-col xl:pl-6">
            <div className="mb-4 flex min-h-8 items-center gap-3">
              <h2 className="font-serif text-xl font-normal leading-tight tracking-tight text-white/95 sm:text-2xl xl:text-xl 2xl:text-2xl">
                Research Implementations
              </h2>
              <div className="hidden h-px flex-1 bg-white/15 2xl:block" aria-hidden="true" />
            </div>

            {/* Default 2 Rows (2 cards in 1-col layout) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-1">
              {visibleResearch.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={projects.length + index}
                  onOpen={setSelected}
                />
              ))}
            </div>

            {/* Extra Research Animated Drawer */}
            <AnimatePresence>
              {isExpanded && extraResearch.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3 pt-3 sm:gap-4 sm:pt-4 xl:grid-cols-1">
                    {extraResearch.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={projects.length + visibleResearch.length + index}
                        onOpen={setSelected}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* =======================================================
            EXPAND MORE BUTTON (Pure Click-Based Toggle)
        ======================================================= */}
        {hasExtra && (
          <div className="mt-6 flex items-center justify-start">
            <button
              type="button"
              onClick={handleClick}
              className="
                group
                inline-flex
                items-center
                gap-2.5
                rounded-full
                border
                border-white/15
                bg-white/[0.03]
                px-4
                py-2
                font-mono
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-white/60
                transition-all
                duration-200
                hover:border-white/35
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              <span>
                {isExpanded
                  ? "Show Less"
                  : `Expand More (${extraProjects.length + extraResearch.length} More)`}
              </span>
              <svg
                className={`h-3 w-3 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : "group-hover:translate-y-0.5"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectDetailOverlay
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
