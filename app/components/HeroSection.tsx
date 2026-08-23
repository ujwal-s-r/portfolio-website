"use client";

import { useState } from "react";
import HeroIntro from "./HeroIntro";
import ExperienceChain from "./ExperienceChain";
import ProjectsGrid from "./ProjectsGrid";
import type { ExperienceItem } from "../lib/experience";
import type { ProjectItem } from "../lib/projects";

interface HeroSectionProps {
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  research: ProjectItem[];
}

export default function HeroSection({
  experiences,
  projects,
  research,
}: HeroSectionProps) {
  const [experienceHovered, setExperienceHovered] = useState(false);

  return (
    <div
      className="w-full min-w-0"
      style={{
        paddingLeft: "64px",
        paddingRight: "1rem",
      }}
    >
      {/* =========================================================
          2-COLUMN GRID: Left identity + Right projects

          Normal:   0.8fr  2fr    (left ~29%, right ~71%)
          Expanded: 1.4fr  1.4fr  (left ~50%, right ~50%)

          The grid-template-columns transition smoothly expands
          the left column when career path is hovered, while
          squeezing the right project cards.
      ========================================================= */}
      <div
        className="w-full grid gap-8 items-start"
        style={{
          gridTemplateColumns: experienceHovered
            ? "1.4fr 1.4fr"
            : "0.8fr 2fr",
          transition:
            "grid-template-columns 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* =====================================================
            LEFT COLUMN — Identity
            Grows wider when career path description opens
        ===================================================== */}
        <div className="flex flex-col items-start gap-6 min-w-0">
          {/* Hero Intro */}
          <div className="w-full shrink-0">
            <HeroIntro />
          </div>

          {/* Career Path */}
          <div className="w-full shrink-0">
            <ExperienceChain
              experiences={experiences}
              onHoverChange={setExperienceHovered}
            />
          </div>
        </div>

        {/* =====================================================
            RIGHT COLUMN — Projects
            Squeezes when left column grows
        ===================================================== */}
        <div className="w-full min-w-0 self-start">
          <ProjectsGrid
            projects={projects}
            research={research}
            compressed={experienceHovered}
          />
        </div>
      </div>
    </div>
  );
}
