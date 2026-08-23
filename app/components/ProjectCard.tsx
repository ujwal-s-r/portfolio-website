"use client";

import { motion } from "framer-motion";
import type { ProjectItem } from "../lib/projects";

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

export default function ProjectCard({
  project,
  index,
}: ProjectCardProps) {
  const hasImage = Boolean(project.image);

  return (
    <motion.article
      className="group relative h-full w-full cursor-pointer select-none"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.75,
        delay: Math.min(index * 0.05, 0.25),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
        transition: {
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      <div
        className="
          relative
          flex
          h-full
          w-full
          flex-col
          overflow-hidden
          rounded-lg
          border
          border-white/[0.12]
          bg-black
          transition-[border-color]
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:border-white/[0.25]
        "
      >
        {/* =========================================================
            IMAGE
        ========================================================= */}

        <div
          className="
            relative
            w-full
            shrink-0
            overflow-hidden
            bg-[#080808]
          "
          style={{
            aspectRatio: "2 / 1",
          }}
        >
          {hasImage ? (
            <img
              src={project.image!}
              alt={project.title}
              loading={index < 4 ? "eager" : "lazy"}
              className="
                block
                h-full
                w-full
                object-cover
                transition-transform
                duration-[1200ms]
                ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-[1.035]
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
                bg-[#080808]
              "
            >
              <span
                className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-white/20
                "
              >
                Project Preview
              </span>
            </div>
          )}

          {/* Subtle image overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/25
              via-transparent
              to-transparent
            "
          />

          {/* =======================================================
              ACTION BUTTONS (GitHub + Live)
          ======================================================= */}

          <div
            className="
              absolute
              right-3
              top-3
              flex
              items-center
              gap-2
              opacity-0
              translate-y-1
              transition-all
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]
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
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/[0.16]
                  bg-black/75
                  text-white/60
                  backdrop-blur-sm
                  transition-colors
                  duration-500
                  ease-out
                  hover:border-white/30
                  hover:text-white
                "
              >
                <svg
                  className="h-[15px] w-[15px]"
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
              </button>
            )}

            {project.liveUrl && (
              <button
                type="button"
                aria-label="Open live demo"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.liveUrl, "_blank");
                }}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-blue-400/30
                  bg-blue-500/90
                  text-white
                  backdrop-blur-sm
                  transition-colors
                  duration-500
                  ease-out
                  hover:bg-blue-400
                "
              >
                <svg
                  className="h-[13px] w-[13px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            CONTENT
        ========================================================= */}

        <div
          className="
            flex
            min-h-0
            flex-1
            flex-col
            px-4
            pb-4
            pt-4
          "
        >
          {/* =======================================================
              TITLE
          ======================================================= */}

          <div
            className="
              mb-2
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <h3
              className="
                min-w-0
                flex-1
                truncate
                font-serif
                text-[16px]
                font-medium
                leading-[1.2]
                tracking-[-0.015em]
                text-white/[0.94]
              "
            >
              {project.title}
            </h3>

            <span
              className="
                shrink-0
                pt-[3px]
                font-mono
                text-[9px]
                tracking-[0.12em]
                text-white/25
              "
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* =======================================================
              DESCRIPTION
          ======================================================= */}

          <p
            className="
              mb-3
              line-clamp-2
              min-h-[36px]
              pr-1
              font-sans
              text-[11px]
              leading-[1.55]
              text-white/[0.52]
            "
          >
            {project.description}
          </p>

          {/* =======================================================
              TECH STACK
          ======================================================= */}

          <div
            className="
              mt-auto
              flex
              min-h-[22px]
              flex-wrap
              items-center
              gap-1.5
              pt-1
            "
          >
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-white/[0.10]
                  bg-white/[0.035]
                  px-2
                  py-1
                  font-mono
                  text-[9px]
                  leading-none
                  tracking-tight
                  text-white/[0.48]
                  transition-colors
                  duration-500
                  ease-out
                  group-hover:text-white/[0.62]
                "
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* =========================================================
            BOTTOM ACCENT
        ========================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-4
            right-4
            h-px
            origin-left
            scale-x-0
            bg-white/[0.35]
            transition-transform
            duration-[900ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:scale-x-100
          "
        />
      </div>
    </motion.article>
  );
}