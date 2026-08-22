import React from "react";
import {
  getProjects,
  getResearch,
  getLearning,
  getExperiences,
  getSkills,
  getLabs,
  getLinkedInPosts,
} from "../lib/content";
import { HeroSection } from "../components/hero/HeroSection";
import { LearningAndLabsSection } from "../components/learning-labs/LearningAndLabsSection";
import { SkillsMarquee } from "../components/skills/SkillsMarquee";
import { GithubSection } from "../components/github/GithubSection";
import { LinkedInSection } from "../components/linkedin/LinkedInSection";

export const revalidate = 3600; // Cache refresh every hour

export default function HomePage() {
  const projects = getProjects();
  const research = getResearch();
  const learningItems = getLearning();
  const experiences = getExperiences();
  const skills = getSkills();
  const labs = getLabs();
  const linkedInPosts = getLinkedInPosts();

  return (
    <div className="space-y-4">
      {/* 1. Hero Viewport: Split Layout (Left: Bio + Experience | Right: Projects + Research) */}
      <HeroSection
        projects={projects}
        research={research}
        experiences={experiences}
      />

      {/* 2. Currently Learning + Embedded Interactive Labs (30% / 70% Split) */}
      <LearningAndLabsSection
        learningItems={learningItems}
        labs={labs}
      />

      {/* 3. Infinite Auto-Scrolling Skills Marquee */}
      <SkillsMarquee skills={skills} />

      {/* 4. Live GitHub Activity & Pinned Repos */}
      <GithubSection />

      {/* 5. LinkedIn Highlights & Engineering Posts */}
      <LinkedInSection posts={linkedInPosts} />
    </div>
  );
}
