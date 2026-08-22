"use client";

import React from "react";
import { ProjectItem } from "../../lib/types";
import { ModalContentData } from "../ui/ModalOverlay";
import { ExternalLink, Terminal } from "lucide-react";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {projects.map((project) => {
        return (
          <motion.div
            key={project.slug}
            whileHover={{
              scale: 1.015,
              borderColor: "rgba(224, 160, 60, 0.45)",
              transition: { duration: 0.16, ease: "easeOut" },
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
            className="group bg-surface border border-border rounded-lg p-3 cursor-pointer hover:bg-surface-hover hover:border-border-hover transition-colors flex flex-col justify-between relative overflow-hidden min-h-[130px]"
          >
            {/* Top Card Bar */}
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-accent px-1.5 py-0.2 rounded bg-accent-muted border border-accent-border flex items-center gap-1">
                  <Terminal size={10} />
                  <span>{project.category}</span>
                </span>

                <div className="flex items-center gap-1 text-text-dim group-hover:text-accent transition-colors">
                  <span className="text-[10px] font-mono">{project.period}</span>
                  <ExternalLink size={10} className="opacity-70 group-hover:opacity-100" />
                </div>
              </div>

              {/* Dominant Project Title */}
              <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent transition-colors tracking-tight mb-1 leading-snug">
                {project.title}
              </h3>

              {/* 1-Line Description */}
              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed mb-2">
                {project.description}
              </p>
            </div>

            {/* Bottom Card Elements */}
            <div>
              {/* Metrics Pill (if exists) */}
              {project.metrics && (
                <div className="text-[10px] font-mono text-accent/90 mb-1.5 flex items-center gap-1 bg-surface-muted px-1.5 py-0.5 rounded border border-border/70 truncate">
                  <span className="text-accent text-[10px]">⚡</span>
                  <span className="truncate">{project.metrics}</span>
                </div>
              )}

              {/* Tech Stack Labels */}
              <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-border/50">
                {project.tech.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1b1b1b] text-text-dim group-hover:text-text-muted border border-border/60"
                  >
                    {t}
                  </span>
                ))}
                {project.tech.length > 4 && (
                  <span className="text-[9px] font-mono text-text-dim">
                    +{project.tech.length - 4}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
