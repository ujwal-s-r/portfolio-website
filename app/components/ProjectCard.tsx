"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ProjectItem } from "../lib/projects";
import { getBlobUrl } from "../lib/blob";

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  onOpen: (project: ProjectItem) => void;
}

export default function ProjectCard({
  project,
  index,
  onOpen,
}: ProjectCardProps) {
  const hasImage = Boolean(project.image);

  return (
    <motion.article
      onClick={() => onOpen(project)}
      className="
        group
        relative
        h-full
        w-full
        cursor-pointer
        select-none
      "
      initial={{
        opacity: 0,
        y: 10,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.025,
        zIndex: 30,
      }}
      style={{
        transformOrigin: "center center",
      }}
    >
      {/* =========================================================
          CARD CONTAINER (PURE BLACK WITH BRIGHT WHITE BORDER)
      ========================================================= */}
      <div
        className="
          relative
          flex
          h-full
          w-full
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-white/20
          bg-black
          transition-all
          duration-400
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:border-white/45
          group-hover:bg-black
          group-hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]
        "
      >
        {/* =======================================================
            IMAGE PREVIEW (COMPACT & NEXT/IMAGE ACCELERATED)
        ======================================================= */}
        <div
          className="
            relative
            w-full
            shrink-0
            overflow-hidden
            bg-black
            aspect-[2.1/1]
          "
        >
          {hasImage ? (
            <Image
              src={getBlobUrl(project.image!)}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 4}
              loading={index < 4 ? "eager" : "lazy"}
              className="
                object-cover
                transition-transform
                duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-[1.03]
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                bg-black
              "
            >
              <span
                className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  text-white/30
                "
              >
                Project Preview
              </span>
            </div>
          )}

          {/* Image fade gradient */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/40
              via-transparent
              to-transparent
            "
          />

          {/* =====================================================
              BLINKING GREEN ONGOING / LIVE BADGE
          ===================================================== */}
          {project.ongoing && (
            <div className="absolute left-2 top-2 z-20 flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-black/85 px-2 py-0.5 backdrop-blur-md shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] font-medium text-emerald-400">
                Ongoing
              </span>
            </div>
          )}

          {/* =====================================================
              ACTION BUTTONS (TOP RIGHT ON HOVER)
          ===================================================== */}
          {(project.github || project.linkedin || project.link) && (
            <div
              className="
                absolute
                right-2.5
                top-2.5
                z-20
                flex
                items-center
                gap-1.5
                translate-y-1
                opacity-0
                transition-all
                duration-200
                ease-out
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              {project.github && (
                <button
                  type="button"
                  aria-label="Open GitHub repository"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.github, "_blank");
                  }}
                  className="
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-black/90
                    text-white/70
                    transition-colors
                    duration-150
                    hover:border-white/40
                    hover:text-white
                  "
                >
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688 0 0-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </button>
              )}

              {project.linkedin && (
                <button
                  type="button"
                  aria-label="Open LinkedIn"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.linkedin, "_blank");
                  }}
                  className="
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-black/90
                    text-white/70
                    transition-colors
                    duration-150
                    hover:border-white/40
                    hover:text-white
                  "
                >
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </button>
              )}

              {project.link && (
                <button
                  type="button"
                  aria-label="Open live project"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.link, "_blank");
                  }}
                  className="
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-black/90
                    text-white/70
                    transition-colors
                    duration-150
                    hover:border-white/40
                    hover:text-white
                  "
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 13a5 5 0 007.07 0l2-2a5 5 0 00-7.07-7.07l-1.15 1.15"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 11a5 5 0 00-7.07 0l-2 2A5 5 0 0012 20.07l1.15-1.15"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* =========================================================
            CONTENT (COMPACT)
        ========================================================= */}
        {/* =========================================================
            CONTENT CONTAINER
            - Padding controls the inner gap & bottom boundary gap (p-3)
        ========================================================= */}
        <div
          className="
            flex
            min-h-0
            flex-1
            flex-col
            justify-between
            p-2
          "
        >
          {/* TITLE & INDEX NUMBER */}
          <div
            className="
              flex
              w-full
              items-start
              justify-between
              gap-2.5
            "
          >
            <h3
              className="
                min-h-[42px]
                sm:min-h-[44px]
                min-w-0
                flex-1
                font-serif
                text-[12.5px]
                font-medium
                leading-[1.3]
                tracking-tight
                text-white/95
                sm:text-[13.5px]
              "
            >
              {project.title}
            </h3>

            {/* Crisp non-distorted index number */}
            <span
              className="
                shrink-0
                font-mono
                text-[10px]
                sm:text-[11px]
                font-normal
                tracking-normal
                text-white/40
                leading-none
                pt-0.5
                select-none
              "
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* TECH STACK - (mt-2 controls gap between title and technologies) */}
          <div className="mt-0.1 flex h-[22px] sm:h-[24px] flex-wrap items-center content-start gap-x-1.5 gap-y-0.5 overflow-hidden font-mono text-[9px] sm:text-[10px] text-white/50">
            {project.techStack.slice(0, 4).map((tech, i) => (
              <span key={tech} className="inline-flex items-center">
                {tech}
                {i < Math.min(project.techStack.length, 4) - 1 && (
                  <span className="text-white/20 ml-1.5 select-none">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}