"use client";

import KineticTextSwapper from "./KineticTextSwapper";

const ROLES = [
  "AIML Engineer",
  "Data Scientist",
  "AI Researcher",
];

export default function HeroIntro() {
  return (
    <div className="w-full flex flex-col items-start select-none">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
        Hi, I&apos;m Ujwal
      </h1>

      {/* Kinetic Text Swapper Sub-headline (Framer 3D Roll) */}
      <div className="mt-2 flex items-center">
        <KineticTextSwapper
          rotatingWords={ROLES}
          animationStyle="3dRoll"
          intervalTime={2.8}
          activeColor="rgb(5, 150, 105)"
          className="text-2xl sm:text-3xl md:text-4xl"
        />
      </div>

      {/* Description Paragraph */}
      <p className="mt-3 text-sm sm:text-base text-white/60 leading-relaxed max-w-lg">
        Building from scratch is what I do for fun.
      </p>
    </div>
  );
}