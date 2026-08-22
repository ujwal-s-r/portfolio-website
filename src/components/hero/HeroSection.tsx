"use client";

import React, { useState } from "react";
import { ProjectItem, ResearchItem, ExperienceItem } from "../../lib/types";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { ProjectsGrid } from "./ProjectsGrid";
import { ResearchSection } from "./ResearchSection";
import { ModalOverlay, ModalContentData } from "../ui/ModalOverlay";
import { siteConfig } from "../../../data/site-config";
import { Terminal, Sparkles } from "lucide-react";

interface HeroSectionProps {
  projects: ProjectItem[];
  research: ResearchItem[];
  experiences: ExperienceItem[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  projects,
  research,
  experiences,
}) => {
  const [activeModalData, setActiveModalData] = useState<ModalContentData | null>(null);

  const handleOpenModal = (data: ModalContentData) => {
    setActiveModalData(data);
  };

  const handleCloseModal = () => {
    setActiveModalData(null);
  };

  return (
    <section className="py-4 lg:min-h-[calc(100vh-4.2rem)] flex flex-col justify-between">
      {/* Shared Modal Overlay */}
      <ModalOverlay
        isOpen={Boolean(activeModalData)}
        onClose={handleCloseModal}
        data={activeModalData}
      />

      {/* Main Grid: Left Column fills top-to-bottom with Experience; Right Column houses Brief + Compact Projects + Research */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 items-stretch">
        {/* ========================================================
            LEFT COLUMN (35-38% / lg:col-span-5): 
            Headline + Experience stretching full height from top to end
           ======================================================== */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
          {/* Top Intro Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[10px] font-mono text-text-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Systems & AI/ML Roles</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-text-primary leading-tight">
                Hi, I&apos;m {siteConfig.name}
              </h1>
              <div className="text-sm font-mono text-accent font-semibold tracking-tight">
                {siteConfig.role}
              </div>
            </div>
          </div>

          {/* Experience Timeline stretching to fill remaining vertical height */}
          <div className="flex-1 flex flex-col justify-between pt-2 border-t border-border/80 min-h-[360px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                <span>Experience Timeline</span>
              </h3>
              <span className="text-[10px] font-mono text-text-dim">
                Click for writeup
              </span>
            </div>

            {/* Vertical timeline taking full height */}
            <ExperienceTimeline
              experiences={experiences}
              onSelectExperience={handleOpenModal}
            />
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (62-65% / lg:col-span-7):
            Brief Block + Compact Projects + Research Implementations
           ======================================================== */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
          {/* Engineering Brief Block */}
          <div className="bg-surface/80 border border-border rounded-lg p-3.5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] font-mono text-accent font-medium px-2 py-0.5 rounded bg-accent-muted border border-accent-border inline-block">
                {siteConfig.subRole}
              </div>
              <span className="text-[10px] font-mono text-text-dim">Engineering Overview</span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              {siteConfig.bio}
            </p>
          </div>

          {/* Compact Projects Grid Header & Tiles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                <span>Selected Projects & Infrastructure</span>
              </h3>
              <span className="text-[10px] font-mono text-text-dim">
                Click to expand
              </span>
            </div>

            {/* Staggered / Compact Projects Grid */}
            <ProjectsGrid
              projects={projects}
              onSelectProject={handleOpenModal}
            />
          </div>

          {/* Compact Research Implementations */}
          <ResearchSection
            research={research}
            onSelectResearch={handleOpenModal}
          />
        </div>
      </div>
    </section>
  );
};
