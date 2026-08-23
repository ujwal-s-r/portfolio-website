"use client";

import { useEffect, useState } from "react";

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  updated_at: string;
  language: string | null;
  topics: string[];
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}

export default function GithubActivity() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch live latest repositories
    fetch("https://api.github.com/users/ujwal-s-r/repos?sort=updated&per_page=4")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // 2. Fetch live contributions heatmap data
    fetch("https://github-contributions-api.jogruber.de/v4/ujwal-s-r?y=last")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.contributions && Array.isArray(data.contributions)) {
          // Take the last ~140 days to fit nicely in the grid
          const days = data.contributions.slice(-140);
          setContributions(days);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* =========================================================
          1. GITHUB ACTIVITY GRAPH
      ========================================================= */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            GitHub Contributions
          </h3>
        </div>

        <a
          href="https://github.com/ujwal-s-r"
          target="_blank"
          rel="noopener noreferrer"
          className="group/gh flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 hover:text-white transition-colors"
        >
          <span>ujwal-s-r</span>
          <svg
            className="h-3 w-3 transition-transform group-hover/gh:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>

      {/* Heatmap Grid */}
      <div className="rounded-2xl border border-white/15 bg-[#0a0a0a] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col gap-3">
          {/* Scrollable / Responsive Grid */}
          <div className="w-full overflow-x-auto pb-1 scrollbar-none">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[340px]">
              {(contributions.length > 0
                ? contributions
                : Array.from({ length: 119 }).map((_, i) => ({
                    date: `${i}`,
                    count: i % 7 === 0 ? 3 : i % 5 === 0 ? 1 : 0,
                    level: i % 7 === 0 ? 3 : i % 5 === 0 ? 1 : 0,
                  }))
              ).map((day, i) => {
                let bgClass = "bg-white/[0.05]";
                if (day.level === 1) bgClass = "bg-emerald-950/80 border border-emerald-800/40";
                if (day.level === 2) bgClass = "bg-emerald-800/80";
                if (day.level === 3) bgClass = "bg-emerald-600";
                if (day.level >= 4) bgClass = "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]";

                return (
                  <span
                    key={i}
                    title={`${day.count} contributions on ${day.date}`}
                    className={`h-3 w-3 rounded-sm transition-transform duration-150 hover:scale-125 ${bgClass}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono text-[9.5px] text-white/35">
            <span>2026 Activity</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <span className="h-2 w-2 rounded-sm bg-white/[0.05]" />
              <span className="h-2 w-2 rounded-sm bg-emerald-950 border border-emerald-800/40" />
              <span className="h-2 w-2 rounded-sm bg-emerald-800" />
              <span className="h-2 w-2 rounded-sm bg-emerald-600" />
              <span className="h-2 w-2 rounded-sm bg-emerald-400" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. LATEST REPOSITORIES (MINIMALIST ROWS)
      ========================================================= */}
      <div className="mt-10">
        <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
          Latest Repositories
        </h4>

        <div className="flex flex-col divide-y divide-white/10">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/repo flex flex-col gap-1.5 py-4 transition-colors duration-150 hover:bg-white/[0.02]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-serif text-[15px] sm:text-[16px] font-normal tracking-tight text-white/95 group-hover/repo:text-emerald-400 transition-colors">
                    {repo.name}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-white/40">
                    {getRelativeTime(repo.updated_at)}
                  </span>
                </div>

                {repo.description && (
                  <p className="text-[12.5px] leading-relaxed text-white/60 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[9.5px] text-white/40">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {repo.language}
                    </span>
                  )}
                  {repo.topics?.slice(0, 3).map((topic) => (
                    <span key={topic} className="text-white/30">
                      #{topic}
                    </span>
                  ))}
                </div>
              </a>
            ))
          ) : (
            <div className="py-6 font-mono text-xs text-white/40">
              Loading public repositories...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
