"use client";

import { useState } from "react";

interface NavItem {
  id: string;
  label?: string;
  href: string;
  external: boolean;
  icon: React.ReactNode;
  showLabel?: boolean;
}

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-[17px] h-[17px]"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[17px] h-[17px]"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-[17px] h-[17px]"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const ResumeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[16px] h-[16px]"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

import { getBlobUrl } from "@/app/lib/blob";

const DEFAULT_RESUME_URL = getBlobUrl("/resume.pdf");

export default function Navbar({
  resumeUrl = DEFAULT_RESUME_URL,
}: {
  resumeUrl?: string;
}) {
  const [isBarHovered, setIsBarHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ujwal-s-r/",
      external: true,
      icon: <LinkedInIcon />,
      showLabel: false,
    },
    {
      id: "email",
      label: "Email",
      href: "mailto:ujwaljeevan123@gmail.com",
      external: false,
      icon: <EmailIcon />,
      showLabel: false,
    },
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/ujwal-s-r",
      external: true,
      icon: <GitHubIcon />,
      showLabel: false,
    },
    {
      id: "resume",
      label: "Resume",
      href: resumeUrl,
      external: true,
      icon: <ResumeIcon />,
      showLabel: true,
    },
  ];

  return (
    <header className="fixed top-3 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
      {/* Dynamic Island Capsule Container - Rock-solid anchored */}
      <nav
        id="dynamic-island-navbar"
        onMouseEnter={() => setIsBarHovered(true)}
        onMouseLeave={() => {
          setIsBarHovered(false);
          setHoveredId(null);
        }}
        className="
          pointer-events-auto
          flex items-center justify-center
          rounded-full select-none
          border max-w-full
        "
        style={{
          transformOrigin: "center center",
          padding: isBarHovered ? "7px 22px" : "6.5px 18px",
          gap: isBarHovered ? "20px" : "16px",
          backgroundColor: isBarHovered
            ? "rgba(18, 18, 20, 0.82)"
            : "rgba(10, 10, 12, 0.70)",
          backdropFilter: "blur(24px) saturate(190%)",
          WebkitBackdropFilter: "blur(24px) saturate(190%)",
          borderColor: isBarHovered
            ? "rgba(255, 255, 255, 0.32)"
            : "rgba(255, 255, 255, 0.12)",
          transform: isBarHovered ? "scale(1.04)" : "scale(1)",
          boxShadow: isBarHovered
            ? "0 0 24px rgba(255, 255, 255, 0.16), 0 16px 40px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.35)"
            : "0 0 10px rgba(255, 255, 255, 0.03), 0 10px 30px rgba(0, 0, 0, 0.7), inset 0 1px 0.5px rgba(255, 255, 255, 0.18)",
          transition:
            "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.4s cubic-bezier(0.16, 1, 0.3, 1), gap 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {navItems.map((item) => {
          const isItemHovered = hoveredId === item.id;

          return (
            <a
              key={item.id}
              id={`nav-${item.id}`}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              aria-label={item.label}
              title={item.label}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="
                group relative flex items-center justify-center
                outline-none cursor-pointer
              "
              style={{
                color: isItemHovered
                  ? "#ffffff"
                  : "rgba(255, 255, 255, 0.65)",
                transform: isItemHovered ? "scale(1.12)" : "scale(1)",
                textShadow: isItemHovered
                  ? "0 0 10px rgba(255, 255, 255, 0.7)"
                  : "none",
                filter: isItemHovered
                  ? "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))"
                  : "none",
                transition:
                  "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s ease, filter 0.25s ease, text-shadow 0.25s ease",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="flex items-center justify-center">
                  {item.icon}
                </span>
                {item.showLabel && (
                  <span className="text-[13px] font-medium tracking-wide">
                    {item.label}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
