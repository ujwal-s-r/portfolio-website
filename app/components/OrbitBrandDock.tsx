"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import { motion, useInView } from "framer-motion";

export interface DockIconItem {
  name: string;
  link: string;
  color: string;
  iconSvg: React.ReactNode;
}

interface OrbitBrandDockProps {
  icons?: DockIconItem[];
  iconSize?: number;
  magnify?: number;
  lift?: number;
  gap?: number;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function gaussian(distance: number, radius: number) {
  const x = distance / Math.max(1, radius);
  return Math.exp(-x * x);
}

export default function OrbitBrandDock({
  icons: iconsProp,
  iconSize = 52,
  magnify = 1.45,
  lift = 14,
  gap = 14,
}: OrbitBrandDockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-10% 0px -10% 0px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pointerX, setPointerX] = useState<number | null>(null);
  const [rect, setRect] = useState<{ left: number; width: number } | null>(
    null
  );

  const defaultIcons: DockIconItem[] = useMemo(
    () => [
      {
        name: "LinkedIn",
        link: "https://www.linkedin.com/in/ujwal-s-r",
        color: "#0A66C2",
        iconSvg: (
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        ),
      },
      {
        name: "GitHub",
        link: "https://github.com/ujwal-s-r",
        color: "#ffffff",
        iconSvg: (
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688 0 0-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        ),
      },
      {
        name: "Mail",
        link: "mailto:ujwalsr2003@gmail.com",
        color: "#EA4335",
        iconSvg: (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        ),
      },
    ],
    []
  );

  const icons = iconsProp || defaultIcons;

  const getCenters = useCallback(() => {
    const w = rect?.width ?? 1;
    const step = iconSize + gap;
    const total = icons.length * iconSize + (icons.length - 1) * gap;
    const start = (w - total) / 2 + iconSize / 2;
    const centers = icons.map((_, i) => start + i * step);
    return { centers, width: w };
  }, [rect, iconSize, gap, icons.length]);

  const interactionRadius = useMemo(() => {
    const base = (iconSize + gap) * 2.2;
    return base * clamp(magnify, 1, 2.2);
  }, [iconSize, gap, magnify]);

  const derived = useMemo(() => {
    const isHovering = pointerX !== null && rect !== null;
    const { centers } = getCenters();
    const scales = centers.map((cx) => {
      if (!isHovering) return 1;
      const d = Math.abs(pointerX - cx);
      const f = gaussian(d, interactionRadius);
      return 1 + (magnify - 1) * f;
    });

    const lifts = centers.map((cx) => {
      if (!isHovering) return 0;
      const d = Math.abs(pointerX - cx);
      const f = gaussian(d, interactionRadius);
      return -lift * f;
    });

    const magnetX = centers.map((cx) => {
      if (!isHovering) return 0;
      const d = pointerX - cx;
      const f = gaussian(Math.abs(d), interactionRadius);
      return clamp(d * 0.05 * f, -14, 14);
    });

    return { scales, lifts, magnetX, isHovering };
  }, [pointerX, rect, getCenters, interactionRadius, magnify, lift]);

  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    startTransition(() => {
      setRect({ left: r.left, width: r.width });
      setPointerX(x);
    });
  }, []);

  const handleLeave = useCallback(() => {
    startTransition(() => {
      setPointerX(null);
      setRect(null);
      setHoveredIndex(null);
    });
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative flex items-center justify-center p-1 select-none"
      role="navigation"
      aria-label="Social Dock"
    >
      <ul className="relative flex items-center justify-center gap-4 p-0 m-0 list-none">
        {icons.map((it, i) => {
          const scale = derived.scales[i] ?? 1;
          const y = derived.lifts[i] ?? 0;
          const mx = derived.magnetX[i] ?? 0;
          const isHovered = hoveredIndex === i;

          return (
            <li key={it.name} className="relative flex items-center justify-center">
              <motion.a
                href={it.link}
                target="_blank"
                rel="noreferrer"
                aria-label={it.name}
                onPointerEnter={() => {
                  startTransition(() => setHoveredIndex(i));
                }}
                onPointerLeave={() => {
                  startTransition(() =>
                    setHoveredIndex((idx) => (idx === i ? null : idx))
                  );
                }}
                animate={{ scale, y, x: mx }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  mass: 0.5,
                }}
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-white/70 transition-colors duration-200 hover:border-white/40 hover:bg-white/[0.12] hover:text-white"
                style={{
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    color: isHovered ? it.color : "rgba(255,255,255,0.85)",
                    transition: "color 180ms ease",
                  }}
                >
                  {it.iconSvg}
                </div>
              </motion.a>

              {/* Tooltip */}
              <motion.div
                role="tooltip"
                aria-hidden={!isHovered}
                animate={
                  isHovered
                    ? { opacity: 1, y: -48, scale: 1 }
                    : { opacity: 0, y: -38, scale: 0.95 }
                }
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 38,
                  mass: 0.5,
                }}
                className="pointer-events-none absolute z-30 rounded-lg border border-white/15 bg-black/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white shadow-xl backdrop-blur-md"
              >
                {it.name}
              </motion.div>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
