"use client";

import React from "react";
import { Github, Linkedin, Twitter, Mail, FileText } from "lucide-react";
import { siteConfig } from "../../../data/site-config";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left Side: Brand / Monogram */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="font-mono font-bold text-sm tracking-tight text-text-primary hover:text-accent transition-colors flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
            <span>{siteConfig.name}</span>
            <span className="text-text-dim text-xs font-normal">/ sys-ai</span>
          </a>

          {/* Social Icon Cluster */}
          <nav className="hidden sm:flex items-center gap-3 border-l border-border pl-5">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <Github size={16} />
            </a>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <Linkedin size={16} />
            </a>
            {siteConfig.socials.twitter && (
              <a
                href={siteConfig.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X Profile"
                className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <Twitter size={16} />
              </a>
            )}
            <a
              href={siteConfig.socials.email}
              aria-label="Email Contact"
              className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <Mail size={16} />
            </a>
          </nav>
        </div>

        {/* Right Side: Resume Button */}
        <div className="flex items-center gap-3">
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold bg-accent text-[#0a0a0a] hover:bg-accent-hover active:scale-95 transition-all shadow-sm"
          >
            <FileText size={14} />
            <span>Resume (PDF)</span>
          </a>
        </div>
      </div>
    </header>
  );
};
