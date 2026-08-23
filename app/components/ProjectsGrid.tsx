"use client";

import type { ProjectItem } from "../lib/projects";
import ProjectCard from "./ProjectCard";

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
  if (projects.length === 0 && research.length === 0) return null;

  return (
    <div
      className="w-full origin-center pr-10 sm:pr-14 md:pr-16 xl:pr-20 2xl:pr-24"
      style={{
        transform: compressed ? "scale(0.94)" : "scale(1)",
        transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="grid grid-cols-1 gap-7 xl:grid-cols-3 xl:gap-4">
        <section className="xl:col-span-2">
          <div className="mb-4 flex min-h-8 items-center gap-4">
            <h2 className="whitespace-nowrap font-serif text-xl font-normal tracking-tight text-white/95 sm:text-2xl">
              Projects
            </h2>
            <div className="h-px flex-1 bg-white/15" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="xl:col-span-1">
          <div className="mb-4 flex min-h-8 items-center gap-3">
            <h2 className="font-serif text-xl font-normal leading-tight tracking-tight text-white/95 sm:text-2xl xl:text-xl 2xl:text-2xl">
              Research Implementations
            </h2>
            <div className="hidden h-px flex-1 bg-white/15 2xl:block" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {research.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={projects.length + index}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
