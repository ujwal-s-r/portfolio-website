"use client";

import React, { useState } from "react";
import { LearningItem, LabItem } from "../../lib/types";
import { ModalOverlay, ModalContentData } from "../ui/ModalOverlay";
import { ExternalLink, Sparkles, Cpu, BookOpen, Layers, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";

interface LearningAndLabsSectionProps {
  learningItems: LearningItem[];
  labs: LabItem[];
}

export const LearningAndLabsSection: React.FC<LearningAndLabsSectionProps> = ({
  learningItems,
  labs,
}) => {
  const [activeModalData, setActiveModalData] = useState<ModalContentData | null>(null);

  const handleOpenModal = (data: ModalContentData) => {
    setActiveModalData(data);
  };

  const handleCloseModal = () => {
    setActiveModalData(null);
  };

  const currentLab = labs[0];

  return (
    <section className="py-12 border-t border-border space-y-10">
      {/* Shared Modal Overlay */}
      <ModalOverlay
        isOpen={Boolean(activeModalData)}
        onClose={handleCloseModal}
        data={activeModalData}
      />

      {/* ========================================================
          TOP 30%: CURRENTLY LEARNING
         ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
              Currently Learning & Systems Deep Dives
            </h3>
          </div>
          <span className="text-[11px] font-mono text-text-dim">
            Ongoing Technical Explorations
          </span>
        </div>

        {/* Horizontal Row of Learning Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {learningItems.map((item) => {
            const isBuilding = item.status === "actively building";

            return (
              <motion.div
                key={item.slug}
                whileHover={{
                  scale: 1.025,
                  borderColor: "rgba(224, 160, 60, 0.4)",
                  transition: { duration: 0.18, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.99 }}
                onClick={() =>
                  onSelectLearningCard(item, handleOpenModal)
                }
                className="group bg-surface border border-border rounded-lg p-4 cursor-pointer hover:bg-surface-hover transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isBuilding
                          ? "bg-amber-950/40 border-accent text-accent"
                          : "bg-surface-muted border-border text-text-dim"
                      }`}
                    >
                      {item.status}
                    </span>

                    <span className="text-[11px] font-mono text-text-dim group-hover:text-accent transition-colors">
                      Roadmap ↗
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors mb-1.5">
                    {item.title}
                  </h4>

                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.progress !== undefined && (
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <div className="flex justify-between items-center text-[10px] font-mono text-text-dim mb-1">
                      <span>Proficiency / Depth</span>
                      <span className="text-text-muted">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-surface-muted h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-accent h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          BOTTOM 70%: EMBEDDED INTERACTIVE LABS
         ======================================================== */}
      {currentLab && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
                  Interactive Lab: {currentLab.title}
                </h3>
              </div>
              <p className="text-xs text-text-muted">{currentLab.description}</p>
            </div>

            <a
              href={currentLab.fullPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-surface hover:bg-surface-hover border border-border hover:border-accent text-text-primary hover:text-accent transition-colors shrink-0"
            >
              <Maximize2 size={13} />
              <span>Open Full ↗</span>
            </a>
          </div>

          {/* Interactive Embed Container */}
          <div className="relative w-full h-[460px] md:h-[540px] bg-surface rounded-lg border border-border overflow-hidden shadow-2xl group">
            {/* Live 3D Simulation Frame */}
            <iframe
              src={currentLab.embedPath}
              title={currentLab.title}
              className="w-full h-full border-0"
              loading="lazy"
            />

            {/* Embedded Caption & Highlights Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-border p-3.5 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-mono text-accent uppercase tracking-wider font-semibold">
                  Live GPU Model
                </span>
                <span className="hidden sm:inline text-text-dim">•</span>
                <span className="text-text-muted text-xs">
                  Rotate & zoom to inspect NVIDIA Hopper/Ada Lovelace SM partition
                </span>
              </div>

              <div className="flex items-center gap-2">
                {currentLab.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

function onSelectLearningCard(
  item: LearningItem,
  onOpen: (data: ModalContentData) => void
) {
  onOpen({
    title: item.title,
    subtitle: `Status: ${item.status}`,
    category: "Learning Deep Dive",
    status: item.status,
    tags: ["Systems", "Architecture", "Engineering Roadmap"],
    resources: item.resources,
    github: item.github,
    markdown: item.content,
  });
}
