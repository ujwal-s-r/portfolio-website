"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { NowItem, SkillGroup } from "../lib/now";

interface NowSectionProps {
  skillGroups: SkillGroup[];
  buildingItems: NowItem[];
  learningItems: NowItem[];
}

export default function NowSection({
  skillGroups,
  buildingItems,
  learningItems,
}: NowSectionProps) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setActiveItemId((prev) => (prev === id ? null : id));
  };

  const renderTimelineList = (items: NowItem[], categoryLabel: string) => (
    <div className="flex flex-col w-full min-w-0">
      {/* Category Header */}
      <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
        {categoryLabel}
      </h3>

      <div className="relative flex flex-col items-start w-full">
        {items.map((item, index) => {
          const isExpanded = activeItemId === item.id;
          const isLast = index === items.length - 1;

          return (
            <div
              key={item.id}
              className="
                relative flex items-stretch w-full cursor-pointer group select-none touch-manipulation
                p-2 -mx-2 sm:p-2.5 sm:-mx-2.5 rounded-xl transition-colors duration-150
                hover:bg-white/[0.03] active:bg-white/[0.06]
              "
              onPointerEnter={(e) => {
                if (e.pointerType !== "touch") setActiveItemId(item.id);
              }}
              onPointerLeave={(e) => {
                if (e.pointerType !== "touch") {
                  setActiveItemId((prev) => (prev === item.id ? null : prev));
                }
              }}
              onClick={() => handleToggle(item.id)}
            >
              {/* =================================================
                  STICK-AND-DOT TIMELINE
              ================================================= */}
              <div className="relative flex flex-col items-center shrink-0 mr-4 self-stretch">
                {/* Dot */}
                <div className="w-4 h-7 flex items-center justify-center relative z-10 shrink-0">
                  <span
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: isExpanded ? "8px" : "6px",
                      height: isExpanded ? "8px" : "6px",
                      backgroundColor: "#ffffff",
                      boxShadow: isExpanded
                        ? "0 0 10px rgba(5, 150, 105, 0.9)"
                        : "0 0 4px rgba(255, 255, 255, 0.5)",
                      transform: isExpanded ? "scale(1.25)" : "scale(1)",
                    }}
                  />
                </div>

                {/* Green Connecting Line */}
                {!isLast && (
                  <div
                    className="w-[2px] flex-1 pointer-events-none"
                    style={{
                      backgroundColor: "rgb(5, 150, 105)",
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* =================================================
                  CONTENT
              ================================================= */}
              <div
                className="flex flex-1 flex-col min-w-0"
                style={{
                  paddingBottom: isLast ? "0px" : isExpanded ? "26px" : "22px",
                  transition: "padding-bottom 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Collapsed Header */}
                <div className="flex flex-col gap-0.5 select-none pt-0.5">
                  <span className="font-serif text-[15.5px] sm:text-[16.5px] font-normal leading-snug tracking-tight text-white/95 group-hover:text-white transition-colors">
                    {item.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                    {item.category}
                  </span>
                </div>

                {/* Expanded In-Place Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2.5 pt-1">
                        {/* Description */}
                        <p className="text-[13px] sm:text-[13.5px] leading-[1.65] text-white/70">
                          {item.description}
                        </p>

                        {/* Tech stack - larger & more legible */}
                        {item.techStack.length > 0 && (
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] sm:text-[12.5px] text-white/60">
                            {item.techStack.map((tech, i) => (
                              <span key={tech} className="inline-flex items-center">
                                <span className="text-white/80">{tech}</span>
                                {i < item.techStack.length - 1 && (
                                  <span className="text-white/25 ml-2 select-none">·</span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* GitHub link */}
                        {item.github && (
                          <div className="pt-0.5">
                            <a
                              href={item.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              <span>GitHub Repo</span>
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl">
        {/* =======================================================
            SECTION MAIN HEADING: NOW
        ======================================================= */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl">
            Now
          </h2>
          <div className="h-px flex-1 bg-white/15" aria-hidden="true" />
        </div>

        {/* =======================================================
            3 EVENLY SPACED COLUMNS: SKILLS | BUILDING | LEARNING
        ======================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start w-full">
          {/* =====================================================
              COLUMN 1: SKILLS (DYNAMICALLY RENDERED FROM MD)
          ===================================================== */}
          <div className="flex flex-col w-full min-w-0">
            <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
              Skills
            </h3>

            <div className="relative flex flex-col items-start w-full">
              {skillGroups.map((group, index) => {
                const isExpanded = activeItemId === group.id;
                const isLast = index === skillGroups.length - 1;

                return (
                  <div
                    key={group.id}
                    className="
                      relative flex items-stretch w-full cursor-pointer group select-none touch-manipulation
                      p-2 -mx-2 sm:p-2.5 sm:-mx-2.5 rounded-xl transition-colors duration-150
                      hover:bg-white/[0.03] active:bg-white/[0.06]
                    "
                    onPointerEnter={(e) => {
                      if (e.pointerType !== "touch") setActiveItemId(group.id);
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType !== "touch") {
                        setActiveItemId((prev) => (prev === group.id ? null : prev));
                      }
                    }}
                    onClick={() => handleToggle(group.id)}
                  >
                    {/* Stick and Dot */}
                    <div className="relative flex flex-col items-center shrink-0 mr-4 self-stretch">
                      <div className="w-4 h-7 flex items-center justify-center relative z-10 shrink-0">
                        <span
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: isExpanded ? "8px" : "6px",
                            height: isExpanded ? "8px" : "6px",
                            backgroundColor: "#ffffff",
                            boxShadow: isExpanded
                              ? "0 0 10px rgba(5, 150, 105, 0.9)"
                              : "0 0 4px rgba(255, 255, 255, 0.5)",
                            transform: isExpanded ? "scale(1.25)" : "scale(1)",
                          }}
                        />
                      </div>

                      {!isLast && (
                        <div
                          className="w-[2px] flex-1 pointer-events-none"
                          style={{
                            backgroundColor: "rgb(5, 150, 105)",
                          }}
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    {/* Skill Category & Sub-names */}
                    <div
                      className="flex flex-1 flex-col min-w-0"
                      style={{
                        paddingBottom: isLast ? "0px" : isExpanded ? "22px" : "18px",
                        transition: "padding-bottom 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="flex flex-col gap-0.5 select-none pt-0.5">
                        <span className="font-serif text-[15.5px] sm:text-[16.5px] font-normal leading-snug tracking-tight text-white/95 group-hover:text-white transition-colors">
                          {group.category}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                          {group.skills.length} Technologies
                        </span>
                      </div>

                      {/* Sub-names revealed on hover / tap (Larger font for easy reading) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[12.5px] sm:text-[13px] leading-relaxed text-white/80 pt-1">
                              {group.skills.map((skill, i) => (
                                <span key={skill} className="inline-flex items-center">
                                  <span className="text-white/90">{skill}</span>
                                  {i < group.skills.length - 1 && (
                                    <span className="text-white/30 ml-2 select-none">·</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =====================================================
              COLUMN 2: BUILDING
          ===================================================== */}
          {renderTimelineList(buildingItems, "Building")}

          {/* =====================================================
              COLUMN 3: LEARNING
          ===================================================== */}
          {renderTimelineList(learningItems, "Learning")}
        </div>
      </div>
    </div>
  );
}
