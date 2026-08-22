"use client";

import React from "react";
import { ResearchItem } from "../../lib/types";
import { ModalContentData } from "../ui/ModalOverlay";
import { BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ResearchSectionProps {
  research: ResearchItem[];
  onSelectResearch: (data: ModalContentData) => void;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({
  research,
  onSelectResearch,
}) => {
  return (
    <div className="mt-4 pt-3.5 border-t border-border/80">
      {/* Section Header / Divider Label */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-primary">
            Research Implementations & First-Principles
          </h4>
        </div>
        <span className="text-[10px] font-mono text-text-dim">
          From Scratch • C++ / CUDA
        </span>
      </div>

      {/* Research Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {research.map((item) => (
          <motion.div
            key={item.slug}
            whileHover={{
              scale: 1.015,
              borderColor: "rgba(224, 160, 60, 0.45)",
              transition: { duration: 0.16, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.99 }}
            onClick={() =>
              onSelectResearch({
                title: item.title,
                subtitle: `Paper: ${item.paper}`,
                category: item.category,
                period: item.period,
                tags: item.tech,
                github: item.github,
                markdown: item.content,
              })
            }
            className="group bg-surface border border-border rounded-lg p-3 cursor-pointer hover:bg-surface-hover transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-accent mb-1">
                <span className="flex items-center gap-1">
                  <BookOpen size={10} />
                  <span>Paper Build</span>
                </span>
                <span className="text-text-dim group-hover:text-accent transition-colors">
                  <ArrowRight size={10} />
                </span>
              </div>

              <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors mb-1 leading-snug line-clamp-1">
                {item.title}
              </h4>

              <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed mb-2">
                {item.description}
              </p>
            </div>

            <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[9px] font-mono text-text-dim">
              <div className="flex flex-wrap gap-1">
                {item.tech.slice(0, 2).map((t) => (
                  <span key={t} className="px-1.5 py-0.2 rounded bg-surface-muted">
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-accent/80 font-medium">Code ↗</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
