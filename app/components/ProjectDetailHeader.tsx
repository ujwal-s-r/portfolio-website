"use client";

import Link from "next/link";

interface ProjectDetailHeaderProps {
  onClose?: () => void;
  backHref?: string;
}

export default function ProjectDetailHeader({
  onClose,
  backHref = "/",
}: ProjectDetailHeaderProps) {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-white/15 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        {/* Back to Overview (Enhanced contrast & emerald hover glow) */}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="group flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/80 transition-all duration-200 hover:text-white"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] transition-all duration-200 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/15 group-hover:text-emerald-400">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </div>
            <span>Back to Overview</span>
          </button>
        ) : (
          <Link
            href={backHref}
            className="group flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/80 transition-all duration-200 hover:text-white"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] transition-all duration-200 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/15 group-hover:text-emerald-400">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </div>
            <span>Back to Overview</span>
          </Link>
        )}

        {/* Circular Close X button (Enhanced border & clear white contrast) */}
        {onClose ? (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] text-white/85 transition-all duration-200 hover:border-white/60 hover:bg-white/[0.15] hover:text-white hover:scale-105 shadow-sm"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <Link
            href={backHref}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] text-white/85 transition-all duration-200 hover:border-white/60 hover:bg-white/[0.15] hover:text-white hover:scale-105 shadow-sm"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
