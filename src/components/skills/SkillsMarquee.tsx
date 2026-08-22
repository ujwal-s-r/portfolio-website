"use client";

import React from "react";
import { SkillItem } from "../../lib/types";
import {
  Cpu,
  Layers,
  Database,
  Server,
  Code2,
  Terminal,
  Activity,
  Box,
  Share2,
} from "lucide-react";

interface SkillsMarqueeProps {
  skills: SkillItem[];
}

export const SkillsMarquee: React.FC<SkillsMarqueeProps> = ({ skills }) => {
  // Duplicate array for seamless infinite looping
  const marqueeItems = [...skills, ...skills];

  return (
    <section className="py-12 border-t border-border overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            Core Technologies & Stack
          </h3>
        </div>
        <span className="text-[11px] font-mono text-text-dim">
          Hover to Pause
        </span>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4 py-2">
          {marqueeItems.map((skill, index) => (
            <div
              key={`${skill.name}-${index}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-md bg-surface border border-border text-text-muted hover:text-text-primary hover:border-accent hover:bg-surface-hover transition-colors shrink-0 select-none group"
            >
              <div className="text-text-dim group-hover:text-accent transition-colors">
                <TechIcon name={skill.name} />
              </div>
              <span className="text-xs font-mono font-semibold tracking-tight">
                {skill.name}
              </span>
              <span className="text-[10px] font-mono text-text-dim px-1.5 py-0.5 rounded bg-surface-muted">
                {skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

function TechIcon({ name }: { name: string }) {
  switch (name.toLowerCase()) {
    case "cuda c++":
    case "triton":
    case "tensorrt":
      return <Cpu size={15} />;
    case "pytorch":
    case "ray":
    case "vllm":
      return <Activity size={15} />;
    case "apache spark":
    case "apache flink":
    case "apache kafka":
      return <Share2 size={15} />;
    case "kubernetes":
    case "docker":
      return <Box size={15} />;
    case "postgresql":
    case "redis":
      return <Database size={15} />;
    case "c++20":
    case "python":
    case "rust":
      return <Code2 size={15} />;
    case "nsight systems":
      return <Terminal size={15} />;
    default:
      return <Layers size={15} />;
  }
}
