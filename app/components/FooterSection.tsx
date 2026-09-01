"use client";

import OrbitBrandDock from "./OrbitBrandDock";
import Logo3DCarousel from "./Logo3DCarousel";
import LiveVisitorBadge from "./LiveVisitorBadge";

interface FooterSectionProps {
  visitorCount?: number;
}

export default function FooterSection({
  visitorCount = 0,
}: FooterSectionProps) {
  return (
    <footer className="w-full flex flex-col items-center justify-center pt-2 pb-4 px-6">
      <div className="w-full max-w-3xl flex flex-col items-center text-center">

        {/* =======================================================
            TOP CAPSULES: SOCIALS & LIVE VISITOR COUNTER
        ======================================================= */}
        <div className="mb-6 flex flex-col items-center justify-center gap-2.5">
          {/* Socials */}
          <div
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-white/[0.04]
              px-4
              py-1.5
              backdrop-blur-md
            "
          >
            <span
              className="
                relative
                -top-[0.5px]
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-emerald-400
                shadow-[0_0_8px_rgba(52,211,153,0.9)]
                animate-pulse
              "
            />

            <span
              className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.24em]
                text-white/70
                leading-none
              "
            >
              Socials
            </span>
          </div>

          {/* Live visitor counter */}
          <LiveVisitorBadge initialCount={visitorCount} />
        </div>

        {/* =======================================================
            MAIN HEADLINE
        ======================================================= */}
        <h2
          className="
            max-w-2xl
            font-serif
            text-3xl
            sm:text-4xl
            md:text-5xl
            font-normal
            tracking-[-0.02em]
            text-white
            leading-[1.15]
          "
        >
          Magic Exists - We call it Engineering
        </h2>

        {/* =======================================================
            SUBTITLE
        ======================================================= */}
        <p
          className="
            mt-3
            font-serif
            italic
            text-base
            sm:text-lg
            text-white/60
            tracking-tight
          "
        >
          DM me on LinkedIn or Drop a Mail
        </p>

        {/* =======================================================
            INSPIRED BY: 3D LOGO CAROUSEL
        ======================================================= */}
        <div
          className="
            mt-10
            mb-7
            w-full
            max-w-2xl
            flex
            flex-col
            items-center
          "
        >
          <span
            className="
              mb-5
              font-mono
              text-[12px]
              sm:text-[13px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-white/60
            "
          >
            Inspired by:
          </span>

          <Logo3DCarousel />
        </div>

        {/* =======================================================
            ORBIT BRAND DOCK
        ======================================================= */}
        <div className="mt-4 mb-4 flex justify-center">
          <OrbitBrandDock />
        </div>

        {/* =======================================================
            LOCATION
        ======================================================= */}
        <a
          href="https://www.google.com/maps/place/Bengaluru,+Karnataka"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bengaluru, India on Google Maps"
          className="
            group/loc
            inline-flex
            items-center
            justify-center
            gap-2
            mb-8
            font-mono
            text-[11px]
            uppercase
            tracking-[0.18em]
            text-white/45
            leading-none
            transition-colors
            duration-200
            hover:text-white
          "
        >
          {/* Location pin */}
          <svg
            className="
              h-3.5
              w-3.5
              shrink-0
              translate-y-[1px]
              text-emerald-400
              transition-transform
              duration-200
              group-hover/loc:scale-110
            "
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>

          {/* Location text */}
          <span className="leading-none">
            Bengaluru, India
          </span>
        </a>

        {/* =======================================================
            BOTTOM COPYRIGHT BAR
        ======================================================= */}
        <div
          className="
            w-full
            flex
            items-center
            justify-center
            border-t
            border-white/10
            pt-6
            font-mono
            text-xs
            text-white/40
            tracking-[0.1em]
          "
        >
          <span>
            © 2026. creations of Logical Minds
          </span>
        </div>

      </div>
    </footer>
  );
}