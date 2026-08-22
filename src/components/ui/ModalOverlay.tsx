"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";
import { MarkdownViewer } from "./MarkdownViewer";

export interface ModalContentData {
  title: string;
  subtitle?: string;
  category?: string;
  period?: string;
  tags?: string[];
  metrics?: string;
  github?: string;
  demo?: string;
  markdown: string;
  status?: string;
  resources?: string[];
}

interface ModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  data: ModalContentData | null;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Dimmed Static Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000]/80 backdrop-blur-[4px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[88vh] bg-surface border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 md:p-6 border-b border-border bg-surface-muted/50">
              <div className="space-y-1.5 pr-8">
                <div className="flex flex-wrap items-center gap-2">
                  {data.category && (
                    <span className="text-[11px] font-mono uppercase tracking-wider text-accent px-2 py-0.5 rounded bg-accent-muted border border-accent-border">
                      {data.category}
                    </span>
                  )}
                  {data.status && (
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/50">
                      {data.status}
                    </span>
                  )}
                  {data.period && (
                    <span className="text-xs font-mono text-text-dim">
                      {data.period}
                    </span>
                  )}
                </div>

                <h2 className="text-lg md:text-xl font-bold text-text-primary tracking-tight">
                  {data.title}
                </h2>

                {data.subtitle && (
                  <p className="text-xs text-text-muted">{data.subtitle}</p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded bg-surface hover:bg-surface-hover border border-border text-text-muted hover:text-text-primary transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions & Tags Bar (if available) */}
            {(data.tags || data.github || data.demo || data.metrics) && (
              <div className="px-5 py-3 border-b border-border bg-surface/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                {data.tags && data.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {data.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-hover text-text-muted border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 shrink-0 ml-auto">
                  {data.github && (
                    <a
                      href={data.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-text-primary hover:text-accent font-mono text-xs transition-colors"
                    >
                      <Github size={13} />
                      <span>Source Code</span>
                      <ExternalLink size={11} className="opacity-60" />
                    </a>
                  )}
                  {data.demo && (
                    <a
                      href={data.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent hover:underline font-mono text-xs"
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Metrics highlight strip */}
            {data.metrics && (
              <div className="px-5 py-2 bg-accent-muted/40 border-b border-accent-border text-xs font-mono text-accent flex items-center gap-2">
                <span>⚡ Performance Metric:</span>
                <span className="text-text-primary font-medium">{data.metrics}</span>
              </div>
            )}

            {/* Modal Body - Internally Scrollable */}
            <div className="p-5 md:p-6 overflow-y-auto space-y-4">
              <MarkdownViewer content={data.markdown} />

              {/* Resources list if present */}
              {data.resources && data.resources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-accent mb-2">
                    Referenced Papers & Roadmaps
                  </h4>
                  <ul className="space-y-1 text-xs text-text-muted font-mono">
                    {data.resources.map((res, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-accent">›</span> {res}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-border bg-surface-muted/50 flex justify-between items-center text-xs font-mono text-text-dim">
              <span>Press ESC or click outside to dismiss</span>
              <button
                onClick={onClose}
                className="px-3 py-1 bg-surface hover:bg-surface-hover border border-border text-text-primary rounded text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
