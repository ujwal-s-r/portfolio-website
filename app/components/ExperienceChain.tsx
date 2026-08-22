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
    <div className="relative w-full max-w-2xl select-none">
      {/* Career Path */}
      <h2
        className="
          text-xs
          uppercase
          tracking-widest
          text-white/40
          font-mono
          font-medium
          mb-5
        "
      >
        Career Path
      </h2>

      {/* Experience list */}
      <div className="relative flex flex-col items-start w-full">
        {experiences.map((exp, index) => {
          const isHovered = hoveredId === exp.id;
          const isLast = index === experiences.length - 1;

          return (
            <div
              key={exp.id}
              className="
                relative
                flex
                items-stretch
                w-full
              "
              onMouseLeave={() => {
                if (isHovered) {
                  setHoveredId(null);
                }
              }}
            >
              {/* =================================================
                  TIMELINE
              ================================================= */}

              <div
                className="
                  relative
                  flex
                  flex-col
                  items-center
                  shrink-0
                  mr-4
                  self-stretch
                "
              >
                {/* Dot */}
                <div
                  className="
                    w-4
                    h-7
                    flex
                    items-center
                    justify-center
                    relative
                    z-10
                    shrink-0
                  "
                >
                  <span
                    className="
                      rounded-full
                      transition-all
                      duration-300
                    "
                    style={{
                      width: isHovered ? "8px" : "6px",
                      height: isHovered ? "8px" : "6px",
                      backgroundColor: isHovered
                        ? "#ffffff"
                        : "rgb(5, 150, 105)",
                      boxShadow: isHovered
                        ? "0 0 10px rgba(5, 150, 105, 0.9)"
                        : "none",
                      transform: isHovered
                        ? "scale(1.2)"
                        : "scale(1)",
                    }}
                  />
                </div>

                {/* Connecting line */}
                {!isLast && (
                  <div
                    className="
                      w-[2px]
                      flex-1
                      pointer-events-none
                    "
                    style={{
                      backgroundColor: "rgb(5, 150, 105)",
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* =================================================
                  EXPERIENCE CONTENT

                  This element owns its own height.

                  Expanding it therefore increases the height of
                  ExperienceChain, which increases the height of
                  the parent layout. Because the parent is centered,
                  the complete block naturally shifts upward.
              ================================================= */}

              <div
                className="
                  flex
                  flex-1
                  flex-col
                  min-w-0
                "
                style={{
                  paddingBottom: isLast
                    ? "0px"
                    : isHovered
                    ? "32px"
                    : "36px",

                  transition:
                    "padding-bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Header */}
                <div
                  className="
                    w-fit
                    max-w-full
                    cursor-pointer
                    inline-flex
                    flex-col
                    group
                    pt-0.5
                  "
                  onMouseEnter={() => setHoveredId(exp.id)}
                >
                  {/* Company + period */}
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3
                      className="
                        text-base
                        md:text-lg
                        font-semibold
                        tracking-tight
                        leading-tight
                        transition-colors
                        duration-200
                      "
                      style={{
                        color: isHovered
                          ? "#ffffff"
                          : "rgba(255,255,255,0.9)",
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

                  {/* Role + location + Key Work */}
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mt-1
                      text-xs
                      md:text-sm
                      text-white/60
                    "
                  >
                    <span>{exp.role}</span>

                    <span className="text-white/30">
                      •
                    </span>

                    <span>{exp.location}</span>

                    <span className="text-white/30">
                      •
                    </span>

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        font-medium
                        text-xs
                      "
                      style={{
                        color: isHovered
                          ? "#ffffff"
                          : "rgba(255,255,255,0.45)",
                      }}
                    >
                      Key Work

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="
                          w-3.5
                          h-3.5
                          transition-transform
                          duration-300
                        "
                        style={{
                          transform: isHovered
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25 4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* =================================================
                    EXPANDABLE WORK

                    IMPORTANT:
                    This is NOT absolute-positioned.

                    Its height becomes real layout height.
                ================================================= */}

                <div
                  className="
                    grid
                    transition-all
                    duration-400
                    ease-out
                  "
                  style={{
                    gridTemplateRows: isHovered
                      ? "1fr"
                      : "0fr",

                    visibility: isHovered
                      ? "visible"
                      : "hidden",

                    pointerEvents: isHovered
                      ? "auto"
                      : "none",

                    transition:
                      "grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s",
                  }}
                  onMouseEnter={() =>
                    setHoveredId(exp.id)
                  }
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
                      {exp.points.map(
                        (point, pIndex) => (
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
                              {renderMarkdownText(
                                point
                              )}
                            </span>
                          </li>
                        )
                      )}
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