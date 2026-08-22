"use client";

import React from "react";
import { Github, Star, GitFork, ExternalLink, Activity, BookOpen } from "lucide-react";
import { siteConfig } from "../../../data/site-config";
import { motion } from "framer-motion";

interface PinnedRepo {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  url: string;
}

const pinnedRepos: PinnedRepo[] = [
  {
    name: "cuda-paged-attention",
    description: "Custom CUDA/C++20 kernel implementation of virtual memory paged KV Cache for high-throughput LLM inference.",
    language: "CUDA C++",
    languageColor: "#00b4d8",
    stars: 142,
    forks: 28,
    url: `https://github.com/${siteConfig.githubUsername}`,
  },
  {
    name: "realtime-flink-feature-store",
    description: "Distributed streaming dual-storage feature store with Flink, Kafka, and Redis online layer.",
    language: "Python / Java",
    languageColor: "#3572A5",
    stars: 98,
    forks: 19,
    url: `https://github.com/${siteConfig.githubUsername}`,
  },
  {
    name: "transformer-cpp-from-scratch",
    description: "Decoder-only GPT Transformer built from scratch in pure C++20 with manual reverse autograd and tiled matmul.",
    language: "C++",
    languageColor: "#f34b7d",
    stars: 215,
    forks: 41,
    url: `https://github.com/${siteConfig.githubUsername}`,
  },
];

export const GithubSection: React.FC = () => {
  return (
    <section className="py-12 border-t border-border space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github size={16} className="text-text-primary" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            GitHub Activity & Pinned Repositories
          </h3>
        </div>

        <a
          href={siteConfig.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-accent transition-colors"
        >
          <span>github.com/{siteConfig.githubUsername}</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* GitHub Live Contribution Heatmap */}
      <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/80 text-xs font-mono">
          <div className="flex items-center gap-2 text-text-muted">
            <Activity size={14} className="text-accent" />
            <span>Contribution Activity</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-dim">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#161b22]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0e4429]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#006d32]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#26a641]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#39d353]" />
            <span>More</span>
          </div>
        </div>

        {/* Live Contribution Calendar Embed / Interactive SVG */}
        <div className="overflow-x-auto py-2">
          <img
            src={`https://ghchart.rshah.org/e0a03c/${siteConfig.githubUsername}`}
            alt="GitHub Contributions Heatmap"
            className="w-full min-w-[650px] max-w-full h-auto filter brightness-95 contrast-125"
            loading="lazy"
            onError={(e) => {
              // Fallback if network blocks dynamic chart
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Pinned Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pinnedRepos.map((repo) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.025,
              borderColor: "rgba(224, 160, 60, 0.4)",
              transition: { duration: 0.18, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.99 }}
            className="group bg-surface border border-border rounded-lg p-4 hover:bg-surface-hover transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-text-primary group-hover:text-accent transition-colors flex items-center gap-1.5 truncate">
                  <BookOpen size={13} className="text-accent shrink-0" />
                  <span className="truncate">{repo.name}</span>
                </span>
                <ExternalLink size={12} className="text-text-dim group-hover:text-accent transition-colors shrink-0" />
              </div>

              <p className="text-xs text-text-muted line-clamp-3 leading-relaxed mb-4">
                {repo.description}
              </p>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-text-dim">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: repo.languageColor }}
                />
                <span>{repo.language}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Star size={11} className="text-text-dim" />
                  <span>{repo.stars}</span>
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={11} className="text-text-dim" />
                  <span>{repo.forks}</span>
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};
