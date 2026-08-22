"use client";

import React, { useState } from "react";
import { ProjectItem, ResearchItem, ExperienceItem } from "../../lib/types";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { ProjectsGrid } from "./ProjectsGrid";
import { ResearchSection } from "./ResearchSection";
import { ModalOverlay, ModalContentData } from "../ui/ModalOverlay";
import { siteConfig } from "../../../data/site-config";
import { Terminal, MapPin, Sparkles, ChevronRight } from "lucide-react";

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
    <section className="pt-8 pb-16">
      {/* Shared Modal Overlay */}
      <ModalOverlay
        isOpen={Boolean(activeModalData)}
        onClose={handleCloseModal}
        data={activeModalData}
      />

      {/* 35-40% Left / 60-65% Right Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ========================================================
            LEFT COLUMN (35-40% / lg:col-span-5)
           ======================================================== */}
        <div className="lg:col-span-5 space-y-8">
          {/* Intro Brief Block */}
          <div className="space-y-4">
            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border text-[11px] font-mono text-text-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Systems & AI/ML Roles</span>
            </div>

            {/* Large Bold Display Typography */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-text-primary leading-[1.1]">
                Hi, I&apos;m {siteConfig.name}
              </h1>
              <div className="text-base sm:text-lg font-mono text-accent font-semibold tracking-tight">
                {siteConfig.role}
              </div>
            </div>

            {/* Transition Focus Statement */}
            <div className="text-xs font-mono text-text-dim px-3 py-1.5 rounded bg-surface-muted border border-border/70 inline-block">
              {siteConfig.subRole}
            </div>

            {/* 2-3 Line Engineering Brief */}
            <p className="text-sm text-text-muted leading-relaxed">
              {siteConfig.bio}
            </p>
          </div>

          {/* Experience Chain Divider */}
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                <span>Experience Timeline</span>
              </h3>
              <span className="text-[11px] font-mono text-text-dim">
                Click cards for writeup
              </span>
            </div>

            {/* Vertical Experience Timeline */}
            <ExperienceTimeline
              experiences={experiences}
              onSelectExperience={handleOpenModal}
            />
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (60-65% / lg:col-span-7)
           ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Projects Header */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              <span>Selected Projects & Infrastructure</span>
            </h3>
            <span className="text-[11px] font-mono text-text-dim">
              Click to expand details
            </span>
          </div>

          {/* Staggered Masonry Projects Grid */}
          <ProjectsGrid
            projects={projects}
            onSelectProject={handleOpenModal}
          />

          {/* Research Implementations Sub-Section */}
          <ResearchSection
            research={research}
            onSelectResearch={handleOpenModal}
          />
        </div>
      </div>
    </section>
  );
};
