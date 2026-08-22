"use client";

import { useEffect, useState } from "react";
import { SECTIONS, SectionItem } from "../data/sections";

interface PageNavigatorProps {
  sections?: SectionItem[];
}

export default function PageNavigator({
  sections = SECTIONS,
}: PageNavigatorProps) {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || "about"
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Track scroll position to update active section indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i].id);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      aria-label="Page navigation"
      className="hidden md:flex fixed left-5 lg:left-7 top-1/2 -translate-y-1/2 z-40 select-none pointer-events-auto"
    >
      <nav className="flex flex-col items-start gap-3.5">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isHovered = hoveredId === section.id;
          const isHighlighted = isActive || isHovered;

          return (
            <div
              key={section.id}
              className="relative flex items-center group cursor-pointer py-1"
              onMouseEnter={() => setHoveredId(section.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => scrollToSection(section.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  scrollToSection(section.id);
                }
              }}
              aria-label={`Scroll to ${section.label}`}
            >
              {/* Minimal Dash Indicator (no rectangular box) */}
              <div className="flex items-center justify-center w-6 h-3">
                <span
                  className="rounded-full transition-all"
                  style={{
                    width: isHighlighted ? "18px" : "10px",
                    height: isHighlighted ? "3px" : "2px",
                    backgroundColor: isHighlighted
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.25)",
                    boxShadow: isHighlighted
                      ? "0 0 5px rgba(255, 255, 255, 0.65)"
                      : "none",
                    transform: isHovered ? "scale(1.15)" : "scale(1)",
                    transition:
                      "width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, box-shadow 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </div>

              {/* Clean Text Label on Hover (Pure Text - No Background or Box) */}
              <div
                className="
                  absolute left-full ml-2
                  pointer-events-none select-none
                "
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered
                    ? "translateX(0)"
                    : "translateX(-4px)",
                  transition:
                    "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <span
                  className="
                    text-[13px] font-medium tracking-wide
                    whitespace-nowrap select-none
                  "
                  style={{
                    color: "rgba(255, 255, 255, 0.95)",
                    textShadow: "0 0 8px rgba(255, 255, 255, 0.35)",
                  }}
                >
                  {section.label}
                </span>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
