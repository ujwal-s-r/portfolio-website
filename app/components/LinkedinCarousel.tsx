"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { LinkedInPostItem } from "../lib/linkedin";

interface LinkedinCarouselProps {
  posts: LinkedInPostItem[];
}

export default function LinkedinCarousel({ posts }: LinkedinCarouselProps) {
  const userItems = useMemo(() => {
    return posts.map((p, idx) => ({
      image: p.image,
      centerText: p.title,
      subText: p.text,
      number: String(idx + 1).padStart(2, "0"),
      link: p.link,
    }));
  }, [posts]);

  // Duplicate items until we have a safe buffer for infinite wrapping (minimum 7)
  const items = useMemo(() => {
    let res = [...(userItems || [])];
    if (res.length === 0) return [];
    while (res.length < 7) {
      res = [...res, ...userItems];
    }
    return res;
  }, [userItems]);

  const N = items.length;
  const progress = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  const spacing = 180;
  const cardWidth = 320;
  const cardHeight = 390;
  const blurIntensity = 50;
  const overlayOpacity = 0.75;
  const damping = 35;

  const [isPaused, setIsPaused] = useState(false);

  // Auto Play functionality (2-second interval)
  useEffect(() => {
    if (isPaused || N === 0) return;

    const timer = setInterval(() => {
      const targetP = Math.round(progress.get()) + 1;
      animate(progress, targetP, {
        type: "spring",
        stiffness: 250,
        damping,
        mass: 1,
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, progress, N, damping]);

  // Mathematical wrap utility for seamless infinite looping
  const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return (((v - min) % rangeSize) + rangeSize) % rangeSize + min;
  };

  // Mouse Wheel / Trackpad Scroll Implementation
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let isScrolling = false;
    let wheelTarget = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (!isScrolling) {
        isScrolling = true;
        wheelTarget = progress.get();
      }

      wheelTarget += e.deltaY / spacing;

      animate(progress, wheelTarget, {
        type: "spring",
        stiffness: 400,
        damping: 40,
        mass: 1,
      });

      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => {
        isScrolling = false;
        const snapped = Math.round(progress.get());
        animate(progress, snapped, {
          type: "spring",
          stiffness: 250,
          damping,
          mass: 1,
        });
      }, 150);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, [progress, spacing, damping]);

  // Drag and Momentum Physics
  const handlePanStart = () => {
    progress.stop();
  };

  const handlePan = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { delta: { y: number } }
  ) => {
    progress.set(progress.get() - info.delta.y / spacing);
  };

  const handlePanEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { velocity: { y: number } }
  ) => {
    const velocity = -info.velocity.y / spacing;
    const target = progress.get() + velocity * 0.15;
    const snapped = Math.round(target);
    animate(progress, snapped, {
      type: "spring",
      stiffness: 250,
      damping,
      mass: 1,
    });
  };

  // Click to snap or open link
  const snapToIndex = (clickedIndex: number, link?: string) => {
    const currentP = progress.get();
    const currentIdx = Math.round(currentP);
    const d = wrap(-N / 2, N / 2, clickedIndex - currentIdx);

    if (Math.abs(d) < 0.3 && link) {
      window.open(link, "_blank");
      return;
    }

    const targetP = currentIdx + d;
    animate(progress, targetP, {
      type: "spring",
      stiffness: 250,
      damping,
      mass: 1,
    });
  };

  const handleNext = () => {
    const currentP = Math.round(progress.get());
    animate(progress, currentP + 1, {
      type: "spring",
      stiffness: 250,
      damping,
      mass: 1,
    });
  };

  const handlePrev = () => {
    const currentP = Math.round(progress.get());
    animate(progress, currentP - 1, {
      type: "spring",
      stiffness: 250,
      damping,
      mass: 1,
    });
  };

  if (posts.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {/* Header with LinkedIn tag & navigation controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#0A66C2] shadow-[0_0_8px_rgba(10,102,194,0.8)]" />
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            LinkedIn Feed
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous Post"
            onClick={handlePrev}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/50 transition-colors duration-150 hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next Post"
            onClick={handleNext}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/50 transition-colors duration-150 hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Infinite 3D Stacking Carousel Stage */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="relative h-[480px] w-full select-none overflow-hidden rounded-2xl border border-white/15 bg-[#050505] shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
        style={{ touchAction: "none" }}
      >
        {/* Dynamic ambient blur backdrop */}
        {items.map((item, i) => (
          <BackgroundLayer
            key={`bg-${i}`}
            index={i}
            image={item.image}
            progress={progress}
            N={N}
            blurIntensity={blurIntensity}
            wrap={wrap}
          />
        ))}

        {/* Pan interactive overlay */}
        <motion.div
          className="absolute inset-0 z-10"
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
        >
          <div className="absolute top-1/2 left-1/2 w-0 h-0">
            {items.map((item, i) => (
              <CarouselItem
                key={`item-${i}`}
                index={i}
                item={item}
                progress={progress}
                N={N}
                spacing={spacing}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                overlayOpacity={overlayOpacity}
                wrap={wrap}
                onTap={() => snapToIndex(i, item.link)}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Hint underneath */}
      <div className="mt-3 flex items-center justify-between px-1 font-mono text-[9.5px] text-white/30">
        <span>Scroll or drag cards vertically</span>
        <span>Tap active card to open</span>
      </div>
    </div>
  );
}

/**
 * Background Layer Component with dynamic crossfade blur
 */
function BackgroundLayer({
  index,
  image,
  progress,
  N,
  blurIntensity,
  wrap,
}: {
  index: number;
  image?: string;
  progress: any;
  N: number;
  blurIntensity: number;
  wrap: (min: number, max: number, v: number) => number;
}) {
  const opacity = useTransform(progress, (p: number) => {
    const d = wrap(-N / 2, N / 2, index - p);
    return Math.max(1 - Math.abs(d), 0);
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        top: -40,
        left: -40,
        right: -40,
        bottom: -40,
        backgroundImage: image ? `url(${image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity,
        filter: `blur(${blurIntensity}px) brightness(0.25)`,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

/**
 * 3D Carousel Stack Item Component
 */
function CarouselItem({
  index,
  item,
  progress,
  N,
  spacing,
  cardWidth,
  cardHeight,
  overlayOpacity,
  wrap,
  onTap,
}: {
  index: number;
  item: {
    image?: string;
    centerText: string;
    subText: string;
    number: string;
    link?: string;
  };
  progress: any;
  N: number;
  spacing: number;
  cardWidth: number;
  cardHeight: number;
  overlayOpacity: number;
  wrap: (min: number, max: number, v: number) => number;
  onTap: () => void;
}) {
  const distance = useTransform(progress, (p: number) =>
    wrap(-N / 2, N / 2, index - p)
  );

  const y = useTransform(distance, (d: number) => d * spacing);
  const scale = useTransform(distance, (d: number) =>
    Math.max(1 - Math.abs(d) * 0.22, 0.55)
  );
  const opacity = useTransform(distance, (d: number) =>
    Math.max(1 - Math.abs(d) * 0.45, 0)
  );
  const zIndex = useTransform(distance, (d: number) =>
    Math.round(100 - Math.abs(d) * 10)
  );
  const filter = useTransform(
    distance,
    (d: number) => `blur(${Math.abs(d) * 2.5}px)`
  );

  return (
    <motion.div
      onTap={onTap}
      style={{
        position: "absolute",
        x: -cardWidth / 2,
        y: useTransform(y, (val: number) => val - cardHeight / 2),
        width: cardWidth,
        height: cardHeight,
        scale,
        opacity,
        zIndex,
        filter,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 20px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.12)",
        cursor: "pointer",
        backgroundColor: "#0d0d0d",
        backgroundImage: item.image ? `url(${item.image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 22,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#ffffff",
          background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.85}) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,${overlayOpacity}) 100%)`,
        }}
      >
        {/* Top title & excerpt */}
        <div>
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
            }}
          >
            {item.centerText}
          </h4>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: 12,
              opacity: 0.8,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.subText}
          </p>
        </div>

        {/* Bottom index and LinkedIn icon indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.1em",
              padding: "5px 10px",
              background: "rgba(10, 102, 194, 0.4)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(10, 102, 194, 0.5)",
              borderRadius: 20,
            }}
          >
            <svg
              style={{ width: 12, height: 12, fill: "currentColor" }}
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>POST</span>
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 300,
              lineHeight: 0.8,
              letterSpacing: "-0.04em",
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "monospace",
            }}
          >
            {item.number}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
