"use client";

import { useState, useEffect } from "react";
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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  return (
    <div className="w-full min-w-0 pl-0 md:pl-16 pr-0 md:pr-4">
      {/* =========================================================
          RESPONSIVE LAYOUT:
          - Mobile / Tablet (< lg): Single column vertical stack:
              1. Hero Intro
              2. Career Path
              3. Projects (2 cards side-by-side)
              4. Research (2 cards side-by-side)
          - Desktop (>= lg): Split grid (Identity ~35% | Projects ~65%)
      ========================================================= */}
      <div
        className="w-full grid gap-10 lg:gap-8 items-start"
        style={{
          gridTemplateColumns: isDesktop
            ? experienceHovered
              ? "1.8fr 1fr"
              : "0.8fr 2fr"
            : "1fr",
          transition: isDesktop
            ? "grid-template-columns 0.45s cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
        }}
      >
        {/* =====================================================
            LEFT COLUMN (Desktop) / TOP SECTION (Mobile)
            Hero Intro + Career Path
        ===================================================== */}
        <div className="flex flex-col items-start gap-8 min-w-0 w-full">
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
            RIGHT COLUMN (Desktop) / BOTTOM SECTION (Mobile)
            Projects (2 cards side by side) + Research
        ===================================================== */}
        <div className="w-full min-w-0 self-start">
          <ProjectsGrid
            projects={projects}
            research={research}
            compressed={isDesktop && experienceHovered}
          />
        </div>
      </div>
    </div>
  );
}
