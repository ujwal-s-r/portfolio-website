"use client";

import { useEffect } from "react";
import type { ProjectItem } from "../lib/projects";

interface ProjectDetailOverlayProps {
  project: ProjectItem;
  onClose: () => void;
}

function renderMarkdownText(text: string) {
  const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function renderImageItem(line: string, index: number) {
  // Regex to extract ![caption](url)
  const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
  if (!imgMatch) return null;

  const rawCaption = imgMatch[1] || "";
  let src = imgMatch[2] || "";

  // Check for size specified via caption ![Caption|small](url) or URL hash (url#small)
  let size = "large";
  let caption = rawCaption;

  if (rawCaption.includes("|")) {
    const parts = rawCaption.split("|");
    caption = parts[0].trim();
    size = parts[1].trim().toLowerCase();
  } else if (src.includes("#")) {
    const parts = src.split("#");
    src = parts[0];
    size = parts[1].toLowerCase();
  }

  // Size mapping
  let sizeClass = "w-full";
  if (size === "small" || size === "sm") {
    sizeClass = "max-w-xs sm:max-w-sm";
  } else if (size === "medium" || size === "md") {
    sizeClass = "max-w-md sm:max-w-lg";
  } else if (size === "large" || size === "lg") {
    sizeClass = "w-full max-w-2xl";
  } else if (size === "full") {
    sizeClass = "w-full";
  }

  return (
    <figure key={`img-${index}`} className={`my-8 mx-auto flex flex-col items-center ${sizeClass}`}>
      <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#080808]">
        <img
          src={src}
          alt={caption || "Project diagram"}
          className="w-full h-auto object-contain block"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-center font-mono text-[11px] text-white/40">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

const GithubIcon = () => (
  <svg
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688 0 0-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

export default function ProjectDetailOverlay({
  project,
  onClose,
}: ProjectDetailOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Lock background page scroll while overlay is open
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] overflow-y-auto overscroll-contain bg-black text-white">
      {/* =========================================================
          TOP BAR
      ========================================================= */}
      <div className="sticky top-0 z-20 border-b border-white/[0.08] bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <button
            type="button"
            onClick={onClose}
            className="
              flex
              items-center
              gap-2
              font-mono
              text-[10px]
              uppercase
              tracking-[0.16em]
              text-white/40
              transition-colors
              duration-200
              hover:text-white
            "
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>

            Back to Projects
          </button>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.12]
              text-white/40
              transition-colors
              duration-200
              hover:border-white/30
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* =========================================================
          CENTERED BLOG / ARTICLE CONTENT
      ========================================================= */}
      <main className="flex w-full justify-center">
        <article
          className="
            w-full
            max-w-[720px]
            px-6
            pb-24
            pt-8
            sm:px-8
            sm:pt-10
          "
        >
          {/* =====================================================
              COMPACT THUMBNAIL BANNER (ABOVE HEADING)
          ===================================================== */}
          {project.image ? (
            <div className="mb-8 w-full overflow-hidden rounded-xl border border-white/10 bg-[#080808]">
              <img
                src={project.image}
                alt={project.title}
                className="h-[180px] sm:h-[220px] w-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-8 flex h-[120px] sm:h-[150px] w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#090909]">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/20">
                {project.title}
              </span>
            </div>
          )}

          {/* =====================================================
              HEADER
          ===================================================== */}
          <header>
            <div className="flex items-start gap-5">
              {/* TITLE */}
              <h1
                className="
                  min-w-0
                  flex-1
                  font-serif
                  text-[32px]
                  font-medium
                  leading-[1.15]
                  tracking-[-0.02em]
                  text-white
                  sm:text-[38px]
                  md:text-[42px]
                "
              >
                {project.title}
              </h1>

              {/* GITHUB + LINKEDIN BESIDE TITLE */}
              <div className="mt-2 flex shrink-0 items-center gap-2">
                <a
                  href={project.github || "https://github.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open GitHub repository"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.14]
                    text-white/50
                    transition-colors
                    duration-200
                    hover:border-white/30
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  <GithubIcon />
                </a>

                <a
                  href={project.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open LinkedIn"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.14]
                    text-white/50
                    transition-colors
                    duration-200
                    hover:border-white/30
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  <LinkedinIcon />
                </a>
              </div>
            </div>
          </header>

          {/* =====================================================
              SEPARATOR
          ===================================================== */}
          <div className="mt-8 h-px w-full bg-white/[0.10]" />

          {/* =====================================================
              CONTENT (POINTS + CONFIGURABLE INLINE IMAGES)
          ===================================================== */}
          <section className="mt-8 space-y-6">
            {project.points.map((point, index) => {
              // If this point is an image tag ![caption](url)
              if (point.startsWith("![") || point.startsWith("<img") || point.startsWith("<image")) {
                return renderImageItem(point, index);
              }

              // Otherwise render regular bullet point with aligned dot
              return (
                <div
                  key={`point-${index}`}
                  className="flex items-start gap-3.5"
                >
                  <span
                    className="
                      flex
                      h-[27px]
                      w-1.5
                      shrink-0
                      items-center
                      justify-center
                      sm:h-[29.6px]
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                  </span>

                  <p
                    className="
                      flex-1
                      text-[15px]
                      leading-[1.8]
                      text-white/75
                      sm:text-[16px]
                      sm:leading-[1.85]
                    "
                  >
                    {renderMarkdownText(point)}
                  </p>
                </div>
              );
            })}
          </section>

          {/* =====================================================
              BOTTOM BACK BUTTON
          ===================================================== */}
          <div className="mt-14 text-center">
            <button
              type="button"
              onClick={onClose}
              className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-white/30
                transition-colors
                duration-200
                hover:text-white/70
              "
            >
              ← Back to Projects
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}