"use client";

import React from "react";
import { Github, Linkedin, Twitter, Mail, FileText, ArrowUp } from "lucide-react";
import { siteConfig } from "../../../data/site-config";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-[#0a0a0a] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left info */}
          <div className="space-y-1 text-center md:text-left">
            <div className="font-mono text-sm font-bold text-text-primary">
              {siteConfig.name} <span className="text-accent">—</span> {siteConfig.role}
            </div>
            <p className="text-xs text-text-muted">
              Built for high-performance AI, distributed systems & hardware-aware computing.
            </p>
          </div>

          {/* Center Socials */}
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 rounded bg-surface border border-border text-text-muted hover:text-text-primary hover:border-border-hover transition-colors"
            >
              <Github size={16} />
            </a>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 rounded bg-surface border border-border text-text-muted hover:text-text-primary hover:border-border-hover transition-colors"
            >
              <Linkedin size={16} />
            </a>
            {siteConfig.socials.twitter && (
              <a
                href={siteConfig.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
                className="p-2 rounded bg-surface border border-border text-text-muted hover:text-text-primary hover:border-border-hover transition-colors"
              >
                <Twitter size={16} />
              </a>
            )}
            <a
              href={siteConfig.socials.email}
              aria-label="Email Me"
              className="p-2 rounded bg-surface border border-border text-text-muted hover:text-accent hover:border-accent-border transition-colors"
            >
              <Mail size={16} />
            </a>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-surface border border-border text-text-primary hover:border-accent hover:text-accent transition-colors"
            >
              <FileText size={13} />
              <span>Resume PDF</span>
            </a>

            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-1.5 rounded bg-surface border border-border text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-text-dim gap-2">
          <div>© {new Date().getFullYear()} {siteConfig.name}. Designed & engineered from first principles.</div>
          <div className="text-[11px]">Next.js • TailwindCSS • Framer Motion</div>
        </div>
      </div>
    </footer>
  );
};
