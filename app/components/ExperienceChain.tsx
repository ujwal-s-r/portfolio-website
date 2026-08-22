"use client";

import { useState } from "react";
import { ExperienceItem } from "../lib/experience";

interface ExperienceChainProps {
  experiences: ExperienceItem[];
}

function renderMarkdownText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={index}
          className="font-semibold text-white"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

export default function ExperienceChain({
  experiences,
}: ExperienceChainProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-2xl py-8 select-none">
      {/* Experience items thread */}
      <div className="relative flex flex-col">
        {/* Continuous vertical thread line */}
        <div
          className="
            absolute
            left-[7px]
            top-3
            bottom-6
            w-[2px]
            bg-white/20
            transition-colors
            duration-300
            pointer-events-none
          "
          aria-hidden="true"
        />

        {experiences.map((exp, index) => {
          const isHovered = hoveredId === exp.id;

          return (
            <div
              key={exp.id}
              className="
                relative
                flex
                items-start
                group
                cursor-pointer
                transition-all
                duration-300
              "
              style={{
                marginBottom:
                  index === experiences.length - 1
                    ? "0px"
                    : isHovered
                    ? "32px"
                    : "44px",
                transition:
                  "margin 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={() => setHoveredId(exp.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Dot on vertical line */}
              <div
                className="
                  relative
                  z-10
                  flex
                  items-center
                  justify-center
                  w-4
                  h-4
                  shrink-0
                  mt-1
                  mr-4
                "
              >
                <span
                  className="rounded-full bg-white transition-all duration-300"
                  style={{
                    width: isHovered ? "9px" : "6px",
                    height: isHovered ? "9px" : "6px",
                    opacity: isHovered ? 1 : 0.75,
                    transform: isHovered ? "scale(1.2)" : "scale(1)",
                    transition:
                      "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, width 0.3s ease, height 0.3s ease",
                  }}
                />
              </div>

              {/* Text content */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3
                    className="
                      text-base
                      md:text-lg
                      font-semibold
                      tracking-tight
                      transition-colors
                      duration-200
                    "
                    style={{
                      color: isHovered
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    {exp.company}
                  </h3>

                  <span
                    className="
                      text-xs
                      md:text-sm
                      font-normal
                      text-white/50
                      whitespace-nowrap
                    "
                  >
                    {exp.period}
                  </span>
                </div>

                {/* Subtitle */}
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mt-0.5
                    text-xs
                    md:text-sm
                    text-white/60
                  "
                >
                  <span>{exp.role}</span>
                  <span className="text-white/30">•</span>
                  <span>{exp.location}</span>
                </div>

                {/* Expandable Points */}
                <div
                  className="grid transition-all duration-400 ease-out"
                  style={{
                    gridTemplateRows: isHovered ? "1fr" : "0fr",
                    transition:
                      "grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div className="overflow-hidden">
                    <ul
                      className="
                        mt-3.5
                        space-y-2.5
                        text-xs
                        md:text-sm
                        text-white/70
                        leading-relaxed
                        transition-opacity
                        duration-300
                      "
                      style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered
                          ? "translateY(0)"
                          : "translateY(-6px)",
                        transition:
                          "opacity 0.35s ease 0.05s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.05s",
                      }}
                    >
                      {exp.points.map((point, pIndex) => (
                        <li
                          key={pIndex}
                          className="
                            flex
                            items-start
                            gap-2.5
                            text-justify
                          "
                        >
                          <span className="text-white/40 mt-[3px] shrink-0">
                            •
                          </span>

                          <span>
                            {renderMarkdownText(point)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}