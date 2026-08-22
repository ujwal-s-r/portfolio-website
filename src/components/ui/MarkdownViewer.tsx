"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <div className="markdown-body prose prose-invert max-w-none text-text-primary text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-text-primary mt-6 mb-3 border-b border-border pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-text-primary mt-5 mb-2 flex items-center gap-2">
              <span className="text-accent font-mono">##</span> {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-text-primary mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold text-accent mt-3 mb-1 uppercase tracking-wider font-mono">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-text-muted text-sm leading-relaxed mb-3">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 text-text-muted mb-4 pl-1 text-sm">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 text-text-muted mb-4 pl-1 text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-text-muted leading-relaxed">{children}</li>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-surface-hover text-accent px-1.5 py-0.5 rounded text-xs font-mono border border-border"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="relative my-4 rounded border border-border bg-[#0e0e0e] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-surface border-b border-border text-[11px] font-mono text-text-dim">
                  <span>code</span>
                  <span className="text-accent">terminal</span>
                </div>
                <pre className="p-3 text-xs font-mono text-text-primary overflow-x-auto leading-relaxed">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent pl-4 italic text-text-muted my-3 bg-surface-muted py-2 pr-3 rounded-r">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline inline-flex items-center gap-1 font-mono text-xs"
            >
              {children} ↗
            </a>
          ),
          strong: ({ children }) => (
            <strong className="text-text-primary font-semibold">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
