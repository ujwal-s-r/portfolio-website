"use client";

import React from "react";
import { ResearchItem } from "../../lib/types";
import { ModalContentData } from "../ui/ModalOverlay";
import { BookOpen, Github, ArrowRight, Code } from "lucide-react";
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
    <div className="mt-8 pt-6 border-t border-border">
      {/* Section Header / Divider Label */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            Research Implementations & First-Principles
          </h4>
        </div>
        <span className="text-[11px] font-mono text-text-dim">
          From Scratch • No High-Level Wrappers
        </span>
      </div>

      {/* Research Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {research.map((item) => (
          <motion.div
            key={item.slug}
            whileHover={{
              scale: 1.025,
              borderColor: "rgba(224, 160, 60, 0.4)",
              transition: { duration: 0.18, ease: "easeOut" },
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
            className="group bg-surface border border-border rounded-lg p-4 cursor-pointer hover:bg-surface-hover transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-accent mb-2">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={11} />
                  <span>Paper Build</span>
                </span>
                <span className="text-text-dim group-hover:text-accent transition-colors">
                  <ArrowRight size={12} />
                </span>
              </div>

              <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors mb-1.5 leading-snug">
                {item.title}
              </h4>

              <div className="text-[11px] font-mono text-text-dim mb-2 italic line-clamp-1">
                {item.paper}
              </div>

              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-text-dim">
              <div className="flex flex-wrap gap-1">
                {item.tech.slice(0, 2).map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded bg-surface-muted">
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-accent/80 font-medium">View Code ↗</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
