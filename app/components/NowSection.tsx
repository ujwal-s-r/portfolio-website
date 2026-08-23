"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { NowItem } from "../lib/now";

interface NowSectionProps {
  buildingItems: NowItem[];
  learningItems: NowItem[];
}

export default function NowSection({
  buildingItems,
  learningItems,
}: NowSectionProps) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setActiveItemId((prev) => (prev === id ? null : id));
  };

  const renderTimelineList = (items: NowItem[], categoryLabel: string) => (
    <div className="flex flex-col w-full">
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
              className="relative flex items-stretch w-full cursor-pointer group"
              onMouseEnter={() => setActiveItemId(item.id)}
              onMouseLeave={() =>
                setActiveItemId((prev) => (prev === item.id ? null : prev))
              }
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
                  <span className="font-serif text-[16px] sm:text-[17px] font-normal leading-snug tracking-tight text-white/95 group-hover:text-white transition-colors">
                    {item.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                    {item.category}
                  </span>
                </div>

                {/* Expanded In-Place Details (No BG, No Repeated Title) */}
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
                        <p className="text-[13px] sm:text-[14px] leading-[1.65] text-white/70">
                          {item.description}
                        </p>

                        {/* Tech stack */}
                        {item.techStack.length > 0 && (
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono text-[10px] text-white/45">
                            {item.techStack.map((tech, i) => (
                              <span key={tech} className="inline-flex items-center">
                                {tech}
                                {i < item.techStack.length - 1 && (
                                  <span className="text-white/20 ml-1.5 select-none">·</span>
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
                              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-400 hover:text-emerald-300 transition-colors"
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
    <div className="w-full min-w-0 pl-0 md:pl-16 pr-0 md:pr-4">
      <div className="w-full max-w-4xl">
        {/* =======================================================
            SECTION MAIN HEADING: NOW
        ======================================================= */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl">
            Now
          </h2>
          <div className="h-px flex-1 bg-white/15" aria-hidden="true" />
        </div>

        {/* Order: Building first, then Learning */}
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-12">
          {/* BUILDING */}
          {renderTimelineList(buildingItems, "Building")}

          {/* LEARNING */}
          {renderTimelineList(learningItems, "Learning")}
        </div>
      </div>
    </div>
  );
}
