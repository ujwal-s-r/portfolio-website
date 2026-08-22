"use client";

import React from "react";
import { ProjectItem } from "../../lib/types";
import { ModalContentData } from "../ui/ModalOverlay";
import { ExternalLink, Github, Terminal, Cpu, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectsGridProps {
  projects: ProjectItem[];
  onSelectProject: (data: ModalContentData) => void;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  onSelectProject,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project, index) => {
        // Create subtle staggered height / offset for loose masonry feel
        const isTall = index % 3 === 0;

        return (
          <motion.div
            key={project.slug}
            whileHover={{
              scale: 1.025,
              borderColor: "rgba(224, 160, 60, 0.4)",
              transition: { duration: 0.18, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.99 }}
            onClick={() =>
              onSelectProject({
                title: project.title,
                subtitle: project.description,
                category: project.category,
                period: project.period,
                tags: project.tech,
                metrics: project.metrics,
                github: project.github,
                demo: project.demo,
                markdown: project.content,
              })
            }
            className={`group bg-surface border border-border rounded-lg p-5 cursor-pointer hover:bg-surface-hover hover:border-border-hover transition-colors flex flex-col justify-between relative overflow-hidden ${
              isTall ? "md:min-h-[220px]" : "md:min-h-[200px]"
            }`}
          >
            {/* Top Card Bar */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent px-2 py-0.5 rounded bg-accent-muted border border-accent-border flex items-center gap-1.5">
                  <Terminal size={11} />
                  <span>{project.category}</span>
                </span>

                <div className="flex items-center gap-1.5 text-text-dim group-hover:text-accent transition-colors">
                  <span className="text-xs font-mono">{project.period}</span>
                  <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                </div>
              </div>

              {/* Dominant Project Title */}
              <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors tracking-tight mb-1.5 leading-snug">
                {project.title}
              </h3>

              {/* 1-Line Description */}
              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-4">
                {project.description}
              </p>
            </div>

            {/* Bottom Card Elements */}
            <div>
              {/* Metrics Pill (if exists) */}
              {project.metrics && (
                <div className="text-[11px] font-mono text-accent/90 mb-3 flex items-center gap-1.5 bg-surface-muted px-2 py-1 rounded border border-border/80">
                  <span className="text-accent text-xs">⚡</span>
                  <span className="truncate">{project.metrics}</span>
                </div>
              )}

              {/* Tech Stack Labels */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1b1b1b] text-text-dim group-hover:text-text-muted border border-border/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
