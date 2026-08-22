"use client";

import { useEffect, useState } from "react";

const ROLES = [
  "AIML Engineer",
  "Data Scientist",
  "AI Researcher",
];

export default function HeroIntro() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRolling(true);

      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setRolling(false);
      }, 1100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-start select-none">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
        Hi, I&apos;m Ujwal
      </h1>

      {/* Fixed-height slot so nothing around it moves */}
      <div className="relative mt-1 h-12 sm:h-14 md:h-16 overflow-hidden">
        <div
          className="h-full flex items-center"
          style={{
            transform: rolling ? "translateY(-110%)" : "translateY(0)",
            opacity: rolling ? 0 : 1,
            transition:
              "transform 1.1s cubic-bezier(0.65, 0, 0.35, 1), opacity 1.1s ease",
          }}
        >
          <span
            className="
              text-2xl
              sm:text-3xl
              md:text-4xl
              font-semibold
              tracking-tight
              whitespace-nowrap
            "
            style={{ color: "rgb(5, 150, 105)" }}
          >
            {ROLES[roleIndex]}
          </span>
        </div>

        {rolling && (
          <div
            className="absolute inset-0 flex items-center"
            style={{
              animation: "roleEnter 1.1s cubic-bezier(0.65, 0, 0.35, 1) forwards",
            }}
          >
            <span
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-semibold
                tracking-tight
                whitespace-nowrap
              "
              style={{ color: "rgb(5, 150, 105)" }}
            >
              {ROLES[(roleIndex + 1) % ROLES.length]}
            </span>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm sm:text-base text-white/60 leading-relaxed max-w-lg">
        Building from scratch is what I do for fun.
      </p>

      <style>{`
        @keyframes roleEnter {
          from {
            transform: translateY(110%);
            opacity: 0;
          }

          60% {
            opacity: 0.7;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}