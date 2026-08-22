"use client";

import React from "react";
import { ExperienceItem } from "../../lib/types";
import { ModalContentData } from "../ui/ModalOverlay";
import { Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ExperienceTimelineProps {
  experiences: ExperienceItem[];
  onSelectExperience: (data: ModalContentData) => void;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  experiences,
  onSelectExperience,
}) => {
  return (
    <div className="relative pl-6 space-y-4">
      {/* Continuous Vertical Line */}
      <div className="absolute left-[7px] top-3 bottom-3 w-[1.5px] bg-border" />

      {experiences.map((exp, index) => (
        <div key={exp.id} className="relative group">
          {/* Accent Timeline Dot */}
          <div className="absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full bg-surface border-2 border-accent group-hover:bg-accent group-hover:scale-110 transition-all duration-200" />

          {/* Interactive Experience Card */}
          <motion.div
            whileHover={{ scale: 1.025, borderColor: "rgba(224, 160, 60, 0.4)" }}
            whileTap={{ scale: 0.99 }}
            onClick={() =>
              onSelectExperience({
                title: exp.role,
                subtitle: `${exp.company} • ${exp.period}`,
                category: "Work Experience",
                period: exp.period,
                tags: exp.tech,
                markdown: exp.markdown,
              })
            }
            className="bg-surface border border-border rounded-lg p-4 cursor-pointer hover:bg-surface-hover transition-colors shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors flex items-center gap-1.5">
                  <span>{exp.role}</span>
                </h4>
                <div className="text-xs font-mono text-text-muted flex items-center gap-1.5 mt-0.5">
                  <span className="text-text-primary font-medium">{exp.company}</span>
                  <span className="text-border">•</span>
                  <span className="text-accent/90">{exp.period}</span>
                </div>
              </div>

              <span className="text-text-dim group-hover:text-accent group-hover:translate-x-0.5 transition-all text-xs shrink-0 mt-0.5">
                <ArrowRight size={13} />
              </span>
            </div>

            <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-2.5">
              {exp.summary}
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              {exp.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-muted text-text-dim border border-border/80"
                >
                  {t}
                </span>
              ))}
              {exp.tech.length > 4 && (
                <span className="text-[10px] font-mono text-text-dim">
                  +{exp.tech.length - 4} more
                </span>
              )}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};
