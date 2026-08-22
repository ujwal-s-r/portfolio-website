"use client";

import React from "react";
import { ExperienceItem } from "../../lib/types";
import { ModalContentData } from "../ui/ModalOverlay";
import { ArrowRight } from "lucide-react";
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
    <div className="relative pl-5 flex flex-col justify-between flex-1 h-full py-1 space-y-3">
      {/* Continuous Vertical Line spanning full top-to-bottom height */}
      <div className="absolute left-[7px] top-3 bottom-3 w-[1.5px] bg-border/80" />

      {experiences.map((exp) => (
        <div key={exp.id} className="relative group flex-1 flex flex-col justify-center">
          {/* Accent Timeline Dot */}
          <div className="absolute -left-[19px] top-3.5 w-3 h-3 rounded-full bg-[#141414] border-2 border-accent group-hover:bg-accent group-hover:scale-125 transition-all duration-200" />

          {/* Interactive Experience Card */}
          <motion.div
            whileHover={{ scale: 1.015, borderColor: "rgba(224, 160, 60, 0.45)" }}
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
            className="bg-surface border border-border rounded-lg p-3.5 cursor-pointer hover:bg-surface-hover transition-colors shadow-sm flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                    {exp.role}
                  </h4>
                  <div className="text-[11px] font-mono text-text-muted flex items-center gap-1.5 mt-0.5">
                    <span className="text-text-primary font-medium">{exp.company}</span>
                    <span className="text-border">•</span>
                    <span className="text-accent/90">{exp.period}</span>
                  </div>
                </div>

                <span className="text-text-dim group-hover:text-accent group-hover:translate-x-0.5 transition-all text-xs shrink-0 mt-0.5">
                  <ArrowRight size={12} />
                </span>
              </div>

              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed mb-2">
                {exp.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-border/50">
              {exp.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-muted text-text-dim border border-border/60"
                >
                  {t}
                </span>
              ))}
              {exp.tech.length > 4 && (
                <span className="text-[9px] font-mono text-text-dim">
                  +{exp.tech.length - 4}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};
