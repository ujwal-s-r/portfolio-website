"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
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

  if (projects.length === 0 && research.length === 0) return null;

  return (
    <>
      <div
        className="w-full origin-center pr-0 sm:pr-4 md:pr-6 lg:pr-8 xl:pr-12"
        style={{
          transform: compressed ? "scale(0.94)" : "scale(1)",
          transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Desktop: 3-column parent grid | Mobile: Stacked sections with 2 cards side-by-side */}
        <div className="flex flex-col gap-10 xl:grid xl:grid-cols-3 xl:gap-5">
          {/* ===================================================
              PROJECTS SECTION (2 cards side by side on mobile)
          =================================================== */}
          <section className="xl:col-span-2">
            <div className="mb-4 flex min-h-8 items-center gap-4">
              <h2 className="whitespace-nowrap font-serif text-xl font-normal tracking-tight text-white/95 sm:text-2xl">
                Projects
              </h2>
              <div className="h-px flex-1 bg-white/15" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onOpen={setSelected}
                />
              ))}
            </div>
          </section>

          {/* ===================================================
              RESEARCH SECTION (Placed after Projects)
          =================================================== */}
          <section className="xl:col-span-1">
            <div className="mb-4 flex min-h-8 items-center gap-3">
              <h2 className="font-serif text-xl font-normal leading-tight tracking-tight text-white/95 sm:text-2xl xl:text-xl 2xl:text-2xl">
                Research Implementations
              </h2>
              <div className="hidden h-px flex-1 bg-white/15 2xl:block" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-1">
              {research.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={projects.length + index}
                  onOpen={setSelected}
                />
              ))}
            </div>
          </section>
        </div>
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
