"use client";

import React from "react";
import { LinkedInPostItem } from "../../lib/types";
import { Linkedin, ExternalLink, MessageSquare, ThumbsUp, Sparkles } from "lucide-react";
import { siteConfig } from "../../../data/site-config";
import { motion } from "framer-motion";

interface LinkedInSectionProps {
  posts: LinkedInPostItem[];
}

export const LinkedInSection: React.FC<LinkedInSectionProps> = ({ posts }) => {
  return (
    <section className="py-12 border-t border-border space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Linkedin size={16} className="text-[#0a66c2]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            Engineering Writings & LinkedIn Highlights
          </h3>
        </div>

        {/* Connect CTA */}
        <a
          href={siteConfig.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-[#0a66c2]/15 text-[#70b5f9] border border-[#0a66c2]/40 hover:bg-[#0a66c2]/25 transition-colors self-start sm:self-auto"
        >
          <Linkedin size={13} />
          <span>Connect on LinkedIn ↗</span>
        </a>
      </div>

      {/* Post Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <motion.a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.025,
              borderColor: "rgba(10, 102, 194, 0.4)",
              transition: { duration: 0.18, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.99 }}
            className="group bg-surface border border-border rounded-lg p-5 hover:bg-surface-hover transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono text-text-dim px-2 py-0.5 rounded bg-surface-muted border border-border">
                  {post.date}
                </span>

                <div className="flex items-center gap-1 text-[#70b5f9] text-xs font-mono opacity-80 group-hover:opacity-100">
                  <span>Read on LinkedIn</span>
                  <ExternalLink size={11} />
                </div>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent transition-colors leading-snug mb-2">
                {post.title}
              </h4>

              <p className="text-xs text-text-muted line-clamp-3 leading-relaxed mb-4">
                {post.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-text-dim">
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-accent/80">
                    #{tag}
                  </span>
                ))}
              </div>

              <span className="text-text-dim text-[10px]">{post.metrics}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};
